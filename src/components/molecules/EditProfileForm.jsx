/**
 * EditProfileForm - Form for editing user profile
 *
 * Features:
 * - Edit name and email
 * - Form validation
 * - Save changes
 * - Cancel option
 */

import { useState } from 'react';
import { Button, Input } from '../atoms';
import { useAuth } from '../../context';

export default function EditProfileForm({ onCancel, onSave }) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El email no es válido');
      return;
    }

    try {
      setSaving(true);

      // Update user in context
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
      });

      // Call parent callback
      if (onSave) {
        await onSave(formData);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Input
        label="Nombre completo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Juan Pérez"
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="juan@ejemplo.com"
        required
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          className="flex-1"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
