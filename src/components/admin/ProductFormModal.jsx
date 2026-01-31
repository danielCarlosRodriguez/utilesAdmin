/**
 * ProductFormModal - Modal para crear/editar productos
 *
 * Features:
 * - Formulario completo para producto
 * - Modo crear y editar
 * - Validación de campos
 * - Upload de imágenes
 * - Especificaciones dinámicas basadas en categoría
 * - Tags dinámicos
 * - Dark mode support
 */

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PhotoIcon, PlusIcon, XCircleIcon, ArrowUpTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useCategories, useAIGeneration, useFocusTrap } from '../../hooks';
import { uploadAPI } from '../../services/api';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { sanitizeHTML, sanitizeURL, isSafeText } from '../../utils/sanitize';

/**
 * Convierte una fecha UTC a formato local para input datetime-local
 * @param {string|Date} utcDate - Fecha en UTC desde el servidor
 * @returns {string} Fecha en formato YYYY-MM-DDTHH:mm en hora local
 */
function formatDateForInput(utcDate) {
  const date = new Date(utcDate);

  // Obtener componentes en hora local
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  loading = false,
}) {
  const { data: categories = [] } = useCategories();
  const {
    generateDescription,
    generateKeywords,
    generatingDescription,
    generatingKeywords,
    error: aiError,
  } = useAIGeneration();

  // Ref para el modal (Focus Trap)
  const modalRef = useRef(null);

  // Implementar Focus Trap
  useFocusTrap(modalRef, isOpen, onClose);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    modelo: '',
    description: '',
    keywords: '',
    cost: '',
    stock: 1, // Siempre 1 para remates
    category: '',
    images: [],
    specifications: {},
    tags: [],
    isActive: true,
    isFeatured: false,
    weight: '',
    // Campos específicos de remates
    priceBase: '',
    priceCurrent: '',
    minIncrement: '',
    bidCount: 0,
    endDate: '',
    startDate: '',
    productStatus: 'active', // Estado del remate (active por defecto)
  });

  const [newTag, setNewTag] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState(null);

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (product) {
      // Encontrar la categoría del producto
      const productCat = categories.find(c => c._id === (product.category?._id || product.category));

      // Procesar specifications: convertir strings de multiselect a arrays
      const processedSpecifications = { ...product.specifications };
      if (productCat?.specificationTemplate) {
        productCat.specificationTemplate.forEach(field => {
          if (field.fieldType === 'multiselect' && processedSpecifications[field.fieldName]) {
            const value = processedSpecifications[field.fieldName];
            // Si es string, convertir a array separando por comas
            if (typeof value === 'string') {
              processedSpecifications[field.fieldName] = value
                .split(',')
                .map(v => v.trim())
                .filter(v => v.length > 0);
            }
          }
        });
      }

      setFormData({
        name: product.name || '',
        modelo: product.modelo || '',
        description: product.description || '',
        keywords: Array.isArray(product.keywords) ? product.keywords.join(', ') : (product.keywords || ''),
        cost: product.cost || '',
        stock: product.stock || 1,
        category: product.category?._id || product.category || '',
        images: product.images || [],
        specifications: processedSpecifications,
        tags: product.tags || [],
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        weight: product.weight || '',
        // Campos específicos de remates
        priceBase: product.priceBase || '',
        priceCurrent: product.priceCurrent || '',
        minIncrement: product.minIncrement || '',
        bidCount: product.bidCount || 0,
        endDate: product.endDate ? formatDateForInput(product.endDate) : '',
        startDate: product.startDate ? formatDateForInput(product.startDate) : '',
        productStatus: 'active', // Siempre activo al cargar
      });

      // Establecer categoría seleccionada
      if (productCat) {
        setSelectedCategory(productCat);
      }
    } else {
      // Reset para modo crear
      setFormData({
        name: '',
        modelo: '',
        description: '',
        keywords: '',
        cost: '',
        stock: 1,
        category: '',
        images: [],
        specifications: {},
        tags: [],
        isActive: true,
        isFeatured: false,
        weight: '',
        // Campos específicos de remates
        priceBase: '',
        priceCurrent: '',
        minIncrement: '',
        bidCount: 0,
        endDate: '',
        startDate: '',
        productStatus: 'active',
      });
      setSelectedCategory(null);
    }
  }, [product, categories]);

  // Actualizar categoría seleccionada cuando cambia
  useEffect(() => {
    if (formData.category) {
      const cat = categories.find(c => c._id === formData.category);
      setSelectedCategory(cat);

      // Inicializar specifications si cambia la categoría
      if (cat && !product) {
        const newSpecs = {};
        cat.specificationTemplate?.forEach(field => {
          // Inicializar multiselect como array vacío, otros como string vacío
          newSpecs[field.fieldName] = field.fieldType === 'multiselect' ? [] : '';
        });
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
      }
    }
  }, [formData.category, categories, product]);

  // Sincronizar Oferta Actual con Oferta Base en modo creación
  useEffect(() => {
    // Solo sincronizar cuando estamos creando un nuevo lote (no hay product)
    if (!product && formData.priceBase) {
      setFormData(prev => ({
        ...prev,
        priceCurrent: prev.priceBase,
      }));
    }
  }, [formData.priceBase, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSpecificationChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [fieldName]: value,
      },
    }));
  };

  // Handler para multiselect (checkboxes múltiples)
  const handleMultiselectChange = (fieldName, optionValue, isChecked) => {
    setFormData(prev => {
      const currentValues = Array.isArray(prev.specifications[fieldName])
        ? prev.specifications[fieldName]
        : [];

      let newValues;
      if (isChecked) {
        // Agregar valor si no existe
        newValues = currentValues.includes(optionValue)
          ? currentValues
          : [...currentValues, optionValue];
      } else {
        // Quitar valor
        newValues = currentValues.filter(v => v !== optionValue);
      }

      return {
        ...prev,
        specifications: {
          ...prev.specifications,
          [fieldName]: newValues,
        },
      };
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Handlers para generación de IA
  const handleGenerateDescription = async () => {
    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Ingresa el nombre del lote primero' }));
      return;
    }

    setAiErrorMessage(null); // Limpiar errores anteriores

    // Obtener el nombre de la categoría seleccionada
    const categoryName = selectedCategory?.name || '';

    const description = await generateDescription(formData.name, categoryName);
    if (description) {
      setFormData(prev => ({
        ...prev,
        description,
      }));
    } else if (aiError) {
      // Mostrar error amigable
      setAiErrorMessage('⚠️ La IA no está configurada en el backend. Contacta al administrador o escribe la descripción manualmente.');
    }
  };

  const handleGenerateKeywords = async () => {
    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Ingresa el nombre del lote primero' }));
      return;
    }

    setAiErrorMessage(null); // Limpiar errores anteriores

    // Obtener el nombre de la categoría seleccionada
    const categoryName = selectedCategory?.name || '';

    const keywords = await generateKeywords(formData.name, categoryName);
    if (keywords) {
      setFormData(prev => ({
        ...prev,
        keywords,
      }));
    } else if (aiError) {
      // Mostrar error amigable
      setAiErrorMessage('⚠️ La IA no está configurada en el backend. Contacta al administrador o escribe las keywords manualmente.');
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      // Sanitizar y validar URL
      const sanitizedUrl = sanitizeURL(imageUrl.trim());

      if (!sanitizedUrl) {
        setErrors(prev => ({
          ...prev,
          images: 'La URL de la imagen no es válida. Debe comenzar con http:// o https://'
        }));
        return;
      }

      // Limpiar error previo
      setErrors(prev => {
        const { images, ...rest } = prev;
        return rest;
      });

      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: sanitizedUrl,
            isPrimary: prev.images.length === 0, // Primera imagen es primaria
          },
        ],
      }));
      setImageUrl('');
    }
  };

  // Función común para procesar archivos (usada por input file y drag & drop)
  const processImageFile = async (file) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, images: 'El archivo debe ser una imagen' }));
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, images: 'La imagen no debe superar los 5MB' }));
      return;
    }

    try {
      setUploadingImage(true);
      setErrors(prev => ({ ...prev, images: null }));

      // Subir imagen a Cloudinary
      const response = await uploadAPI.uploadImage(file);

      if (response.success && response.data?.url) {
        // Agregar imagen al formulario
        setFormData(prev => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: response.data.url,
              isPrimary: prev.images.length === 0,
            },
          ],
        }));
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setErrors(prev => ({
        ...prev,
        images: err.message || 'Error al subir la imagen. Intenta nuevamente.'
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  // Handler para input file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    await processImageFile(file);
    // Reset input
    e.target.value = '';
  };

  // Handlers para drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files?.[0];
    await processImageFile(file);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length > 200) {
      newErrors.name = 'El nombre no puede exceder 200 caracteres';
    } else if (!isSafeText(formData.name)) {
      newErrors.name = 'El nombre contiene caracteres no permitidos';
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'La descripción no puede exceder 5000 caracteres';
    } else if (!isSafeText(formData.description)) {
      newErrors.description = 'La descripción contiene caracteres no permitidos';
    }

    // Validar modelo (opcional pero con límites si se proporciona)
    if (formData.modelo && formData.modelo.length > 100) {
      newErrors.modelo = 'El modelo no puede exceder 100 caracteres';
    } else if (formData.modelo && !isSafeText(formData.modelo)) {
      newErrors.modelo = 'El modelo contiene caracteres no permitidos';
    }

    // Validar keywords
    if (formData.keywords && formData.keywords.length > 500) {
      newErrors.keywords = 'Las palabras clave no pueden exceder 500 caracteres';
    } else if (formData.keywords && !isSafeText(formData.keywords)) {
      newErrors.keywords = 'Las palabras clave contienen caracteres no permitidos';
    }

    // Validar oferta base (precio inicial del remate)
    if (!formData.priceBase || formData.priceBase <= 0) {
      newErrors.priceBase = 'La oferta base debe ser mayor a 0';
    } else if (formData.priceBase > 99999999) {
      newErrors.priceBase = 'La oferta base es demasiado alta';
    }

    // Validar fecha de fin (requerida)
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin del remate es requerida';
    } else {
      const endDate = new Date(formData.endDate);
      const now = new Date();
      const startDate = formData.startDate ? new Date(formData.startDate) : now;

      // Validar que la fecha de fin sea futura
      if (endDate <= now && !product) {
        newErrors.endDate = 'La fecha de fin debe ser futura';
      }

      // Validar que la fecha de fin sea posterior a la de inicio
      if (formData.startDate && endDate <= startDate) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    // Validar oferta actual (opcional, solo debe ser >= oferta base)
    if (formData.priceCurrent && formData.priceCurrent < formData.priceBase) {
      newErrors.priceCurrent = 'La oferta actual no puede ser menor a la oferta base';
    }

    // Validar cost (opcional)
    if (formData.cost && formData.cost > 99999999) {
      newErrors.cost = 'El costo es demasiado alto';
    }

    // Mantener compatibilidad con price y compareAtPrice (mapear a los nuevos campos)
    formData.price = formData.priceBase || formData.price;
    formData.compareAtPrice = formData.priceCurrent || formData.compareAtPrice;

    // Validar stock
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    } else if (formData.stock > 999999) {
      newErrors.stock = 'El stock es demasiado alto';
    }

    // Validar categoría
    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    // Validar imágenes
    if (formData.images.length === 0) {
      newErrors.images = 'Debe agregar al menos una imagen';
    } else {
      // Validar cada URL de imagen
      const invalidImages = formData.images.filter(img => !sanitizeURL(img.url));
      if (invalidImages.length > 0) {
        newErrors.images = `${invalidImages.length} imagen(es) tienen URLs inválidas`;
      }
    }

    // Validar tags
    if (formData.tags.length > 0) {
      const invalidTags = formData.tags.filter(tag => !isSafeText(tag) || tag.length > 50);
      if (invalidTags.length > 0) {
        newErrors.tags = 'Algunos tags contienen caracteres no permitidos o son demasiado largos';
      }
    }

    // Validar especificaciones requeridas
    if (selectedCategory?.specificationTemplate) {
      selectedCategory.specificationTemplate.forEach(field => {
        const value = formData.specifications[field.fieldName];
        if (field.required) {
          // Para multiselect verificar que el array tenga elementos
          if (field.fieldType === 'multiselect') {
            if (!Array.isArray(value) || value.length === 0) {
              newErrors[`spec_${field.fieldName}`] = `${field.fieldName} es requerido`;
            }
          } else {
            // Para otros tipos verificar que no esté vacío
            if (!value) {
              newErrors[`spec_${field.fieldName}`] = `${field.fieldName} es requerido`;
            }
          }
        }

        // Validar seguridad de especificaciones si tienen valor
        if (value && typeof value === 'string') {
          if (!isSafeText(value)) {
            newErrors[`spec_${field.fieldName}`] = `${field.fieldName} contiene caracteres no permitidos`;
          }
        } else if (Array.isArray(value)) {
          const invalidValues = value.filter(v => typeof v === 'string' && !isSafeText(v));
          if (invalidValues.length > 0) {
            newErrors[`spec_${field.fieldName}`] = `${field.fieldName} contiene valores no permitidos`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Procesar specifications: convertir arrays (multiselect) a strings
    const processedSpecifications = {};
    Object.keys(formData.specifications).forEach(key => {
      const value = formData.specifications[key];
      // Si es array (multiselect), convertir a string separado por comas
      if (Array.isArray(value)) {
        processedSpecifications[key] = value.join(', ');
      } else {
        processedSpecifications[key] = value;
      }
    });

    // Convertir valores numéricos y preparar datos
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      stock: 1, // Siempre 1 para remates
      category: formData.category,
      images: formData.images,
      specifications: processedSpecifications,
      tags: formData.tags,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      // Campos específicos de remates
      priceBase: parseFloat(formData.priceBase),
      minIncrement: parseFloat(formData.minIncrement),
      bidCount: parseInt(formData.bidCount) || 0,
      productStatus: formData.productStatus, // Estado del remate
    };

    // Si es un nuevo lote, la oferta actual toma el valor de la oferta base
    // Si es edición y tiene oferta actual, usar ese valor
    const currentPrice = product && formData.priceCurrent
      ? parseFloat(formData.priceCurrent)
      : parseFloat(formData.priceBase);

    submitData.priceCurrent = currentPrice;

    // Agregar campos opcionales solo si tienen valor
    if (formData.modelo?.trim()) {
      submitData.modelo = formData.modelo.trim();
    }
    if (formData.keywords?.trim()) {
      // Convertir el string de keywords separadas por comas a array
      submitData.keywords = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    }
    if (formData.cost) {
      submitData.cost = parseFloat(formData.cost);
    }
    if (formData.weight) {
      submitData.weight = parseFloat(formData.weight);
    }

    // Fechas del remate
    if (formData.endDate) {
      submitData.endDate = new Date(formData.endDate).toISOString();
    }
    if (formData.startDate) {
      submitData.startDate = new Date(formData.startDate).toISOString();
    }

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header con fondo azul */}
          <div className="sticky top-0 z-10 bg-linear-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-t-lg px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  id="modal-title"
                  className="text-2xl font-bold text-white mb-1"
                >
                  {product ? "Editar Lote de Remate" : "Crear Lote de Remate"}
                </h2>
                <p className="text-sm text-primary-100">
                  {product
                    ? "Actualiza la información del lote"
                    : "Completa los campos para crear un nuevo lote de remate"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Alerta de Error de IA */}
            {aiErrorMessage && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {aiErrorMessage}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiErrorMessage(null)}
                    className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-800 dark:hover:text-yellow-300"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Estado del Remate */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                    Estado
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {formData.productStatus === "active"
                      ? "Activado"
                      : "No Activado"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      productStatus:
                        prev.productStatus === "active" ? "pending" : "active",
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    formData.productStatus === "active"
                      ? "bg-green-500"
                      : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.productStatus === "active"
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Nombre del Lote *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Ej: Samsung Galaxy S24 Ultra"
                  />
                </div>

                <Input
                  label="Modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Ej: SM-S928B"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 ${
                      errors.category
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Descripción *
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={generatingDescription || !formData.name.trim()}
                      className="flex items-center gap-1 text-xs"
                      title={
                        !formData.name.trim()
                          ? "Ingresa el nombre del lote primero"
                          : "Generar descripción con IA"
                      }
                    >
                      {generatingDescription ? (
                        <>
                          <span className="inline-block w-3 h-3 border-2 border-celeste-500 border-t-transparent rounded-full animate-spin"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4" />
                          Generar con IA
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 ${
                      errors.description
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    placeholder="Descripción detallada del lote de remate..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Keywords SEO
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleGenerateKeywords}
                      disabled={generatingKeywords || !formData.name.trim()}
                      className="flex items-center gap-1 text-xs"
                      title={
                        !formData.name.trim()
                          ? "Ingresa el nombre del lote primero"
                          : "Generar keywords con IA"
                      }
                    >
                      {generatingKeywords ? (
                        <>
                          <span className="inline-block w-3 h-3 border-2 border-celeste-500 border-t-transparent rounded-full animate-spin"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4" />
                          Generar con IA
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    placeholder="palabras clave, separadas, por comas, para, seo..."
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Palabras clave relevantes para SEO, separadas por comas
                  </p>
                </div>
              </div>
            </div>

            {/* Configuración de Remate */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Configuración de Remate
              </h3>

              {/* Precios del Remate */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Oferta Base *"
                  name="priceBase"
                  type="number"
                  step="0.01"
                  value={formData.priceBase}
                  onChange={handleChange}
                  error={errors.priceBase}
                  placeholder="0.00"
                  hint="Precio inicial del remate"
                />

                <Input
                  label="Oferta Actual"
                  name="priceCurrent"
                  type="number"
                  step="0.01"
                  value={formData.priceCurrent}
                  onChange={handleChange}
                  placeholder="0.00"
                  hint="Puja más alta actual"
                  disabled={!product}
                />

                <Input
                  label="Incremento Mínimo *"
                  name="minIncrement"
                  type="number"
                  step="0.01"
                  value={formData.minIncrement}
                  onChange={handleChange}
                  error={errors.minIncrement}
                  placeholder="0.00"
                  hint="Incremento mínimo de puja"
                />
              </div>

              {/* Fechas del Remate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fecha de Inicio"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  hint="Fecha y hora de inicio del remate"
                />

                <Input
                  label="Fecha de Fin *"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  hint="Fecha y hora de cierre del remate"
                />
              </div>

              {/* Campos ocultos - no necesarios para remates */}
              {/* Cantidad de Ofertas, Costo, Stock y Peso están ocultos */}
            </div>

            {/* Especificaciones Técnicas */}
            {selectedCategory?.specificationTemplate && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  Especificaciones Técnicas
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {selectedCategory.specificationTemplate
                    .sort((a, b) => a.order - b.order)
                    .map((field) => (
                      <div key={field.fieldName}>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {field.fieldName} {field.required && "*"}
                          {field.unit && (
                            <span className="text-neutral-500">
                              {" "}
                              ({field.unit})
                            </span>
                          )}
                        </label>

                        {field.fieldType === "select" ? (
                          <select
                            value={
                              formData.specifications[field.fieldName] || ""
                            }
                            onChange={(e) =>
                              handleSpecificationChange(
                                field.fieldName,
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="">Seleccionar...</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : field.fieldType === "multiselect" ? (
                          <div className="space-y-2 border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900/50">
                            {field.options?.map((opt) => {
                              const currentValues = Array.isArray(
                                formData.specifications[field.fieldName]
                              )
                                ? formData.specifications[field.fieldName]
                                : [];
                              const isChecked = currentValues.includes(opt);

                              return (
                                <label
                                  key={opt}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      handleMultiselectChange(
                                        field.fieldName,
                                        opt,
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 text-celeste-600 border-neutral-300 rounded focus:ring-celeste-500"
                                  />
                                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                    {opt}
                                  </span>
                                </label>
                              );
                            })}
                            {(!field.options || field.options.length === 0) && (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                No hay opciones disponibles
                              </p>
                            )}
                          </div>
                        ) : field.fieldType === "boolean" ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                formData.specifications[field.fieldName] ||
                                false
                              }
                              onChange={(e) =>
                                handleSpecificationChange(
                                  field.fieldName,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-celeste-600 border-neutral-300 rounded focus:ring-celeste-500"
                            />
                            <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                              Sí
                            </span>
                          </div>
                        ) : (
                          <input
                            type={
                              field.fieldType === "number" ? "number" : "text"
                            }
                            value={
                              formData.specifications[field.fieldName] || ""
                            }
                            onChange={(e) =>
                              handleSpecificationChange(
                                field.fieldName,
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                            placeholder={`Ej: ${field.fieldName}`}
                          />
                        )}

                        {errors[`spec_${field.fieldName}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`spec_${field.fieldName}`]}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Imágenes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Imágenes *
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Columna 1: Agregar por URL */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Cargar por URL
                  </h4>
                  <div className="flex flex-col gap-2">
                    <Input
                      placeholder="URL de la imagen"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddImage}
                      variant="secondary"
                      disabled={uploadingImage}
                      className="w-full"
                    >
                      <span className="inline-flex items-center justify-center w-full">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Agregar Imagen
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Columna 2: Subir desde archivo (Drag & Drop) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Cargar desde PC
                  </h4>
                  <label className="block">
                    <div
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:border-celeste-500 dark:hover:border-celeste-400 transition-colors bg-neutral-50 dark:bg-neutral-900 min-h-[120px]"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-neutral-400 dark:text-neutral-500 mb-2" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {uploadingImage ? (
                            <span className="flex items-center gap-2">
                              <span className="inline-block w-4 h-4 border-2 border-celeste-500 border-t-transparent rounded-full animate-spin"></span>
                              Subiendo...
                            </span>
                          ) : (
                            <>
                              <span className="font-medium text-celeste-600 dark:text-celeste-400">
                                Subir imagen
                              </span>{" "}
                              o arrastra aquí
                            </>
                          )}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          PNG, JPG, GIF hasta 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
              )}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700"
                    >
                      <img
                        src={image.url}
                        alt={`Producto ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!image.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(index)}
                            className="px-2 py-1 bg-white text-neutral-900 text-xs rounded"
                          >
                            Principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 bg-red-500 text-white rounded"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Badge principal */}
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-celeste-500 text-white text-xs rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags - Ocultos para remates */}
            {/* Etiquetas no se usan en el sistema de remates */}

            {/* Opciones - Ocultas para remates */}
            {/* Lote activo y Lote destacado se controlan con el toggle de Estado del Remate */}

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 -mx-6 -mb-6 px-6 py-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ProductFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  product: PropTypes.object,
  loading: PropTypes.bool,
};
