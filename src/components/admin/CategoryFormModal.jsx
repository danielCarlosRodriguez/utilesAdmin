/**
 * CategoryFormModal - Modal para crear/editar categorías
 *
 * Features:
 * - Formulario completo para categoría
 * - Modo crear y editar
 * - Validación de campos
 * - Upload de imagen
 * - Gestión dinámica de specificationTemplate
 * - Dark mode support
 */

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  PlusIcon,
  XCircleIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { uploadAPI } from "../../services/api";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

// Función helper para generar el fieldLabel automáticamente desde fieldName
const generateFieldLabel = (fieldName) => {
  if (!fieldName) return '';

  // Convertir a Title Case: "tasa de refresco" -> "Tasa De Refresco"
  return fieldName
    .split(/[\s-_]+/) // Dividir por espacios, guiones o guiones bajos
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category = null,
  loading = false,
}) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    specificationTemplate: [],
    isActive: true,
  });

  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado para nuevo campo de especificación
  const [newField, setNewField] = useState({
    fieldName: "",
    fieldType: "text",
    required: false,
    unit: "",
    options: [],
    order: 1,
  });

  // Estado para input temporal de opciones
  const [newOptionInput, setNewOptionInput] = useState("");
  const [editOptionInput, setEditOptionInput] = useState("");

  // Estado para editar opciones en el módulo "Agregar Campo"
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editingOptionValue, setEditingOptionValue] = useState("");

  // Estado para editar campo existente
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [editField, setEditField] = useState(null);

  // Estado para editar opciones en el campo que se está editando
  const [editingEditFieldOptionIndex, setEditingEditFieldOptionIndex] =
    useState(null);
  const [editingEditFieldOptionValue, setEditingEditFieldOptionValue] =
    useState("");

  // Cargar datos de la categoría si está en modo edición
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        specificationTemplate: category.specificationTemplate || [],
        isActive: category.isActive ?? true,
      });
      setImageUrl(category.image || "");
    } else {
      // Reset para modo crear
      setFormData({
        name: "",
        description: "",
        image: "",
        specificationTemplate: [],
        isActive: true,
      });
      setImageUrl("");
    }
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const uploadImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "El archivo debe ser una imagen",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "La imagen no debe superar los 5MB",
      }));
      return;
    }

    try {
      setUploadingImage(true);
      setErrors((prev) => ({ ...prev, image: null }));

      const response = await uploadAPI.uploadImage(file);

      if (response.success && response.data?.url) {
        setFormData((prev) => ({ ...prev, image: response.data.url }));
        setImageUrl(response.data.url);
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setErrors((prev) => ({
        ...prev,
        image: err.message || "Error al subir la imagen",
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadImage(file);
    e.target.value = "";
  };

  // Drag & Drop handlers
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
    if (file) {
      await uploadImage(file);
    }
  };

  const handleAddImageByUrl = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({ ...prev, image: imageUrl.trim() }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageUrl("");
  };

  // Funciones para manejar opciones del nuevo campo
  const handleAddNewOption = () => {
    if (
      newOptionInput.trim() &&
      !newField.options.includes(newOptionInput.trim())
    ) {
      setNewField((prev) => ({
        ...prev,
        options: [...prev.options, newOptionInput.trim()],
      }));
      setNewOptionInput("");
    }
  };

  const handleRemoveNewOption = (optionToRemove) => {
    setNewField((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt !== optionToRemove),
    }));
  };

  // Funciones para editar opciones en el módulo "Agregar Campo"
  const handleStartEditOption = (index, currentValue) => {
    setEditingOptionIndex(index);
    setEditingOptionValue(currentValue);
  };

  const handleSaveEditOption = () => {
    if (editingOptionValue.trim() && editingOptionIndex !== null) {
      // Verificar que no exista otra opción con el mismo valor
      const isDuplicate = newField.options.some(
        (opt, idx) => opt === editingOptionValue.trim() && idx !== editingOptionIndex
      );

      if (isDuplicate) {
        return; // No guardar si es duplicado
      }

      setNewField((prev) => ({
        ...prev,
        options: prev.options.map((opt, idx) =>
          idx === editingOptionIndex ? editingOptionValue.trim() : opt
        ),
      }));
      setEditingOptionIndex(null);
      setEditingOptionValue("");
    }
  };

  const handleCancelEditOption = () => {
    setEditingOptionIndex(null);
    setEditingOptionValue("");
  };

  // Funciones para manejar opciones del campo en edición
  const handleAddEditOption = () => {
    if (
      editOptionInput.trim() &&
      !editField.options.includes(editOptionInput.trim())
    ) {
      setEditField((prev) => ({
        ...prev,
        options: [...prev.options, editOptionInput.trim()],
      }));
      setEditOptionInput("");
    }
  };

  const handleRemoveEditOption = (optionToRemove) => {
    setEditField((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt !== optionToRemove),
    }));
  };

  // Funciones para editar opciones en el módulo de "Editar Campo"
  const handleStartEditEditFieldOption = (index, currentValue) => {
    setEditingEditFieldOptionIndex(index);
    setEditingEditFieldOptionValue(currentValue);
  };

  const handleSaveEditEditFieldOption = () => {
    if (
      editingEditFieldOptionValue.trim() &&
      editingEditFieldOptionIndex !== null
    ) {
      // Verificar que no exista otra opción con el mismo valor
      const isDuplicate = editField.options.some(
        (opt, idx) =>
          opt === editingEditFieldOptionValue.trim() &&
          idx !== editingEditFieldOptionIndex
      );

      if (isDuplicate) {
        return; // No guardar si es duplicado
      }

      setEditField((prev) => ({
        ...prev,
        options: prev.options.map((opt, idx) =>
          idx === editingEditFieldOptionIndex
            ? editingEditFieldOptionValue.trim()
            : opt
        ),
      }));
      setEditingEditFieldOptionIndex(null);
      setEditingEditFieldOptionValue("");
    }
  };

  const handleCancelEditEditFieldOption = () => {
    setEditingEditFieldOptionIndex(null);
    setEditingEditFieldOptionValue("");
  };

  const handleAddSpecField = () => {
    // Validar campos del nuevo field
    if (!newField.fieldName.trim()) {
      setErrors((prev) => ({
        ...prev,
        specField: "El nombre del campo es requerido",
      }));
      return;
    }

    // Validar que no exista ya un field con ese nombre
    if (
      formData.specificationTemplate.some(
        (f) => f.fieldName === newField.fieldName
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        specField: "Ya existe un campo con ese nombre",
      }));
      return;
    }

    // Validar que si es select o multiselect, tenga al menos una opción
    if ((newField.fieldType === "select" || newField.fieldType === "multiselect") && newField.options.length === 0) {
      setErrors((prev) => ({
        ...prev,
        specField: "Debes agregar al menos una opción",
      }));
      return;
    }

    // Agregar el nuevo campo (generar fieldLabel automáticamente)
    const fieldToAdd = {
      fieldName: newField.fieldName.trim(),
      fieldLabel: generateFieldLabel(newField.fieldName.trim()),
      fieldType: newField.fieldType,
      required: newField.required,
      order: formData.specificationTemplate.length + 1,
    };

    // Agregar unit si existe
    if (newField.unit?.trim()) {
      fieldToAdd.unit = newField.unit.trim();
    }

    // Agregar options si es select o multiselect
    if ((newField.fieldType === "select" || newField.fieldType === "multiselect") && newField.options.length > 0) {
      fieldToAdd.options = newField.options;
    }

    setFormData((prev) => ({
      ...prev,
      specificationTemplate: [...prev.specificationTemplate, fieldToAdd],
    }));

    // Reset nuevo field
    setNewField({
      fieldName: "",
      fieldType: "text",
      required: false,
      unit: "",
      options: [],
      order: 1,
    });
    setNewOptionInput("");
    setErrors((prev) => ({ ...prev, specField: null }));
  };

  const handleRemoveSpecField = (index) => {
    setFormData((prev) => ({
      ...prev,
      specificationTemplate: prev.specificationTemplate.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleEditSpecField = (index) => {
    const field = formData.specificationTemplate[index];
    setEditingFieldIndex(index);
    setEditField({
      fieldName: field.fieldName,
      fieldLabel: field.fieldLabel,
      fieldType: field.fieldType,
      required: field.required,
      unit: field.unit || "",
      options: field.options || [],
      order: field.order,
    });
    setEditOptionInput("");
  };

  const handleSaveEditField = () => {
    // Validar campos del editField
    if (!editField.fieldName.trim()) {
      setErrors((prev) => ({
        ...prev,
        editField: "El nombre del campo es requerido",
      }));
      return;
    }

    // Validar que no exista ya un field con ese nombre (excepto el que se está editando)
    if (
      formData.specificationTemplate.some(
        (f, i) => f.fieldName === editField.fieldName && i !== editingFieldIndex
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        editField: "Ya existe un campo con ese nombre",
      }));
      return;
    }

    // Validar que si es select o multiselect, tenga al menos una opción
    if ((editField.fieldType === "select" || editField.fieldType === "multiselect") && editField.options.length === 0) {
      setErrors((prev) => ({
        ...prev,
        editField: "Debes agregar al menos una opción",
      }));
      return;
    }

    // Actualizar el campo (generar fieldLabel automáticamente)
    const updatedField = {
      fieldName: editField.fieldName.trim(),
      fieldLabel: generateFieldLabel(editField.fieldName.trim()),
      fieldType: editField.fieldType,
      required: editField.required,
      order: editField.order,
    };

    // Agregar unit si existe
    if (editField.unit?.trim()) {
      updatedField.unit = editField.unit.trim();
    }

    // Agregar options si es select o multiselect
    if ((editField.fieldType === "select" || editField.fieldType === "multiselect") && editField.options.length > 0) {
      updatedField.options = editField.options;
    }

    setFormData((prev) => ({
      ...prev,
      specificationTemplate: prev.specificationTemplate.map((field, i) =>
        i === editingFieldIndex ? updatedField : field
      ),
    }));

    // Reset edición
    setEditingFieldIndex(null);
    setEditField(null);
    setEditOptionInput("");
    setErrors((prev) => ({ ...prev, editField: null }));
  };

  const handleCancelEdit = () => {
    setEditingFieldIndex(null);
    setEditField(null);
    setEditOptionInput("");
    setErrors((prev) => ({ ...prev, editField: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.image) newErrors.image = "La imagen es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image,
      specificationTemplate: formData.specificationTemplate,
      isActive: formData.isActive,
    };

    onSubmit(submitData);
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
        <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header con fondo azul */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-t-lg px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {category ? "Editar Categoría" : "Crear Categoría"}
                </h2>
                <p className="text-sm text-primary-100">
                  {category ? 'Actualiza la información de la categoría' : 'Completa los campos para crear una nueva categoría'}
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
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Nombre de la Categoría *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Ej: Smartphones"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    placeholder="Descripción de la categoría..."
                  />
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Imagen *
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
                      onClick={handleAddImageByUrl}
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

              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}

              {/* Preview */}
              {formData.image && (
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover border-2 border-neutral-200 dark:border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Plantilla de Especificaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Plantilla de Especificaciones
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Define los campos técnicos que tendrán los productos de esta
                categoría
              </p>

              {/* Campos existentes */}
              {formData.specificationTemplate.length > 0 && (
                <div className="space-y-2">
                  {formData.specificationTemplate.map((field, index) => (
                    <div key={index}>
                      {editingFieldIndex === index ? (
                        // Modo edición
                        <div className="border border-celeste-300 dark:border-celeste-700 rounded-lg p-4 space-y-3 bg-celeste-50/30 dark:bg-celeste-900/10">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              Editar Campo
                            </h4>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            {/* Fila 1: Nombre del Campo y Tipo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Input
                                label="Nombre del Campo"
                                placeholder="ej: pantalla"
                                value={editField.fieldName}
                                onChange={(e) =>
                                  setEditField((prev) => ({
                                    ...prev,
                                    fieldName: e.target.value,
                                  }))
                                }
                              />
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                  Tipo
                                </label>
                                <select
                                  value={editField.fieldType}
                                  onChange={(e) =>
                                    setEditField((prev) => ({
                                      ...prev,
                                      fieldType: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                                >
                                  <option value="text">Texto</option>
                                  <option value="number">Número</option>
                                  <option value="boolean">Sí/No</option>
                                  <option value="select">Opciones (una)</option>
                                  <option value="multiselect">Múltiples Opciones</option>
                                </select>
                              </div>
                            </div>

                            {/* Gestión de Opciones (solo si tipo es select o multiselect) */}
                            {(editField.fieldType === "select" || editField.fieldType === "multiselect") && (
                              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900/50">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                  Opciones
                                </label>

                                {/* Input y botón para agregar opción */}
                                <div className="flex gap-2 mb-3">
                                  <Input
                                    placeholder="Agregar opción"
                                    value={editOptionInput}
                                    onChange={(e) =>
                                      setEditOptionInput(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddEditOption();
                                      }
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handleAddEditOption}
                                    variant="secondary"
                                    className="shrink-0"
                                  >
                                    <PlusIcon className="w-5 h-5" />
                                  </Button>
                                </div>

                                {/* Lista de opciones agregadas */}
                                {editField.options.length > 0 && (
                                  <div className="space-y-1">
                                    {editField.options.map((option, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700"
                                      >
                                        {editingEditFieldOptionIndex === idx ? (
                                          // Modo edición
                                          <>
                                            <Input
                                              value={editingEditFieldOptionValue}
                                              onChange={(e) =>
                                                setEditingEditFieldOptionValue(
                                                  e.target.value
                                                )
                                              }
                                              onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                  e.preventDefault();
                                                  handleSaveEditEditFieldOption();
                                                } else if (e.key === "Escape") {
                                                  e.preventDefault();
                                                  handleCancelEditEditFieldOption();
                                                }
                                              }}
                                              className="flex-1"
                                              autoFocus
                                            />
                                            <div className="flex gap-1">
                                              <button
                                                type="button"
                                                onClick={
                                                  handleSaveEditEditFieldOption
                                                }
                                                className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                title="Guardar"
                                              >
                                                <svg
                                                  className="w-4 h-4"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                  />
                                                </svg>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={
                                                  handleCancelEditEditFieldOption
                                                }
                                                className="p-1 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 rounded transition-colors"
                                                title="Cancelar"
                                              >
                                                <XMarkIcon className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          // Modo visualización
                                          <>
                                            <span className="text-sm text-neutral-900 dark:text-neutral-100">
                                              {option}
                                            </span>
                                            <div className="flex gap-1">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleStartEditEditFieldOption(
                                                    idx,
                                                    option
                                                  )
                                                }
                                                className="p-1 text-celeste-600 hover:bg-celeste-50 dark:hover:bg-celeste-900/20 rounded transition-colors"
                                                title="Editar opción"
                                              >
                                                <PencilIcon className="w-4 h-4" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveEditOption(option)
                                                }
                                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="Eliminar opción"
                                              >
                                                <TrashIcon className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Fila 2: Unidad (opcional) */}
                            <div className="grid grid-cols-1 gap-3">
                              <Input
                                label="Unidad (opcional)"
                                placeholder="ej: GB, mAh, kg"
                                value={editField.unit}
                                onChange={(e) =>
                                  setEditField((prev) => ({
                                    ...prev,
                                    unit: e.target.value,
                                  }))
                                }
                              />
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                La etiqueta se generará automáticamente desde el nombre del campo
                              </p>
                            </div>

                            {/* Checkbox requerido */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editField.required}
                                onChange={(e) =>
                                  setEditField((prev) => ({
                                    ...prev,
                                    required: e.target.checked,
                                  }))
                                }
                                className="w-4 h-4 text-celeste-600 border-neutral-300 rounded focus:ring-celeste-500"
                              />
                              <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                                Campo requerido
                              </span>
                            </div>
                          </div>

                          {errors.editField && (
                            <p className="text-red-500 text-sm">
                              {errors.editField}
                            </p>
                          )}

                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              onClick={handleCancelEdit}
                              variant="outline"
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSaveEditField}
                              variant="primary"
                            >
                              Guardar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Modo visualización
                        <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {field.fieldName}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-celeste-100 dark:bg-celeste-900/30 text-celeste-700 dark:text-celeste-400">
                                {field.fieldType === "select" ? "Opciones (una)" :
                                 field.fieldType === "multiselect" ? "Múltiples Opciones" :
                                 field.fieldType === "text" ? "Texto" :
                                 field.fieldType === "number" ? "Número" :
                                 field.fieldType === "boolean" ? "Sí/No" :
                                 field.fieldType}
                              </span>
                              {field.required && (
                                <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                  Requerido
                                </span>
                              )}
                              {field.unit && (
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                  Unidad: {field.unit}
                                </span>
                              )}
                            </div>
                            {field.options && (
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Opciones: {field.options.join(", ")}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditSpecField(index)}
                              className="p-2 text-celeste-600 hover:bg-celeste-50 dark:hover:bg-celeste-900/20 rounded transition-colors"
                              title="Editar campo"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecField(index)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Eliminar campo"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar nuevo campo */}
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Agregar Campo
                </h4>

                <div className="space-y-3">
                  {/* Fila 1: Nombre del Campo y Tipo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Nombre del Campo"
                      placeholder="ej: pantalla"
                      value={newField.fieldName}
                      onChange={(e) =>
                        setNewField((prev) => ({
                          ...prev,
                          fieldName: e.target.value,
                        }))
                      }
                    />
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Tipo
                      </label>
                      <select
                        value={newField.fieldType}
                        onChange={(e) =>
                          setNewField((prev) => ({
                            ...prev,
                            fieldType: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-celeste-500 focus:border-celeste-500 transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="boolean">Sí/No</option>
                        <option value="select">Opciones (una)</option>
                        <option value="multiselect">Múltiples Opciones</option>
                      </select>
                    </div>
                  </div>

                  {/* Gestión de Opciones (solo si tipo es select o multiselect) */}
                  {(newField.fieldType === "select" || newField.fieldType === "multiselect") && (
                    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900/50">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Opciones
                      </label>

                      {/* Input y botón para agregar opción */}
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Agregar opción"
                          value={newOptionInput}
                          onChange={(e) => setNewOptionInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddNewOption();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddNewOption}
                          variant="secondary"
                          className="shrink-0"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Lista de opciones agregadas */}
                      {newField.options.length > 0 && (
                        <div className="space-y-1">
                          {newField.options.map((option, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700"
                            >
                              {editingOptionIndex === idx ? (
                                // Modo edición
                                <>
                                  <Input
                                    value={editingOptionValue}
                                    onChange={(e) =>
                                      setEditingOptionValue(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSaveEditOption();
                                      } else if (e.key === "Escape") {
                                        e.preventDefault();
                                        handleCancelEditOption();
                                      }
                                    }}
                                    className="flex-1"
                                    autoFocus
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={handleSaveEditOption}
                                      className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                      title="Guardar"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditOption}
                                      className="p-1 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 rounded transition-colors"
                                      title="Cancelar"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                // Modo visualización
                                <>
                                  <span className="text-sm text-neutral-900 dark:text-neutral-100">
                                    {option}
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStartEditOption(idx, option)
                                      }
                                      className="p-1 text-celeste-600 hover:bg-celeste-50 dark:hover:bg-celeste-900/20 rounded transition-colors"
                                      title="Editar opción"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveNewOption(option)}
                                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                      title="Eliminar opción"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fila 2: Unidad (opcional) */}
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      label="Unidad (opcional)"
                      placeholder="ej: GB, mAh, kg"
                      value={newField.unit}
                      onChange={(e) =>
                        setNewField((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      La etiqueta se generará automáticamente desde el nombre del campo
                    </p>
                  </div>

                  {/* Checkbox requerido */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) =>
                        setNewField((prev) => ({
                          ...prev,
                          required: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-celeste-600 border-neutral-300 rounded focus:ring-celeste-500"
                    />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                      Campo requerido
                    </span>
                  </div>
                </div>

                {errors.specField && (
                  <p className="text-red-500 text-sm">{errors.specField}</p>
                )}

                <Button
                  type="button"
                  onClick={handleAddSpecField}
                  variant="secondary"
                  // Mantén w-full y otras clases de estilo, pero quita las de alineación horizontal
                  className="w-full"
                >
                  {/* Nuevo: Un SPAN con clases Flexbox que envuelve el ícono y el texto */}
                  <span className="inline-flex items-center justify-center w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Agregar Campo
                  </span>
                </Button>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Estado
              </h3>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-celeste-600 border-neutral-300 rounded focus:ring-celeste-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Categoría activa
                </span>
              </label>
            </div>

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
                {loading ? "Guardando..." : category ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

CategoryFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  category: PropTypes.object,
  loading: PropTypes.bool,
};
