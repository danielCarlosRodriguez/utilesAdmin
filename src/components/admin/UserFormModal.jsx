/**
 * UserFormModal - Modal para crear/editar usuarios
 *
 * Features:
 * - Formulario para crear/editar usuario
 * - Validación de campos
 * - Gestión de roles y estado
 */

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useFocusTrap } from '../../hooks';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { isSafeText } from '../../utils/sanitize';

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  loading = false,
}) {
  // Ref para el modal (Focus Trap)
  const modalRef = useRef(null);

  // Implementar Focus Trap
  useFocusTrap(modalRef, isOpen, onClose);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  const [errors, setErrors] = useState({});

  // Cargar datos del usuario si está en modo edición
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
      });
    } else {
      // Reset para modo crear
      setFormData({
        name: '',
        email: '',
        role: 'user',
      });
    }
    setErrors({});
  }, [user, isOpen]);

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

  const validate = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    } else if (!isSafeText(formData.name)) {
      newErrors.name = 'El nombre contiene caracteres no permitidos';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

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
      email: formData.email.trim(),
      role: formData.role,
    };

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
          className="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2
              id="modal-title"
              className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {user ? "Editar Usuario" : "Crear Usuario"}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nombre */}
            <Input
              label="Nombre Completo *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Ej: Juan Pérez"
            />

            {/* Email */}
            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="juan@ejemplo.com"
              disabled={!!user} // No permitir cambiar email en edición por seguridad/consistencia
            />

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
              >
                {user ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

UserFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool,
};
