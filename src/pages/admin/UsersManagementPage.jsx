/**
 * UsersManagementPage - Página de gestión de usuarios (Admin)
 *
 * Features:
 * - Listado de usuarios
 * - Visualización de roles y estados
 */

import { useState, useEffect, useCallback } from 'react';
import { Header, Footer } from '../../components/organisms';
import UserTable from '../../components/admin/UserTable';
import UserFormModal from '../../components/admin/UserFormModal';
import UserDetailModal from '../../components/admin/UserDetailModal';
import { usersAPI } from '../../services/api';
import { useToast } from '../../context';

export default function UsersManagementPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      // Asumiendo que la respuesta es { success: true, data: [...] } o directamente [...]
      // Ajustar según la estructura real de la respuesta de la API
      const usersData = response.data || response; 
      setUsers(Array.isArray(usersData) ? usersData : []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los usuarios'
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    setViewingUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingUser(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);

    try {
      if (editingUser) {
        // Actualizar usuario existente
        await usersAPI.update(editingUser._id, formData);
        showToast({ type: 'success', title: 'Éxito', message: 'Usuario actualizado correctamente' });
      } else {
        // Crear nuevo usuario
        await usersAPI.create(formData);
        showToast({ type: 'success', title: 'Éxito', message: 'Usuario creado correctamente' });
      }

      handleCloseModal();
      fetchUsers(); // Recargar lista
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al guardar el usuario'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.name}"?`)) {
      return;
    }

    try {
      await usersAPI.delete(user._id);
      showToast({ type: 'success', title: 'Éxito', message: 'Usuario eliminado correctamente' });
      fetchUsers(); // Recargar lista
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al eliminar el usuario'
      });
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role === 'admin').length;
  const activeUsers = users.filter(user => user.isActive).length;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow">
        <section className="bg-linear-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-white">
                  Gestión de Usuarios
                </h1>
                <p className="text-sm text-primary-100">
                  {loading ? 'Cargando...' : `${totalUsers} usuarios en total`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total de usuarios
                </p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {loading ? '—' : totalUsers}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Administradores
                </p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {loading ? '—' : adminCount}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Usuarios activos
                </p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {loading ? '—' : activeUsers}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <UserTable
              users={users}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>
        </section>
      </main>

      <Footer />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={editingUser}
        loading={submitting}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        user={viewingUser}
      />
    </div>
  );
}
