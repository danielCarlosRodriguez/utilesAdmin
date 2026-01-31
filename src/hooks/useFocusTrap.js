import { useEffect } from 'react';

/**
 * Hook para implementar Focus Trap en modales
 * Previene que el foco salga del modal cuando está abierto
 *
 * @param {React.RefObject} ref - Referencia al contenedor del modal
 * @param {boolean} isActive - Si el modal está activo/abierto
 * @param {Function} onClose - Función para cerrar el modal
 */
export const useFocusTrap = (ref, isActive, onClose) => {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;

    // Selector de elementos focuseables
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableElements = element.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Guardar el elemento que tenía el foco antes de abrir el modal
    const previouslyFocusedElement = document.activeElement;

    // Enfocar el primer elemento cuando se abre el modal
    if (firstElement) {
      // Pequeño delay para asegurar que el modal esté renderizado
      setTimeout(() => {
        firstElement.focus();
      }, 0);
    }

    /**
     * Maneja la navegación con Tab
     */
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      // Si solo hay un elemento focuseable, prevenir navegación
      if (focusableElements.length === 1) {
        e.preventDefault();
        return;
      }

      // Tab + Shift: retroceder
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      }
      // Tab: avanzar
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    /**
     * Maneja la tecla Escape
     */
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    /**
     * Previene el foco fuera del modal al hacer click
     */
    const handleFocusOut = (e) => {
      if (!element.contains(e.relatedTarget)) {
        // Si el foco sale del modal, regresarlo al primer elemento
        firstElement?.focus();
      }
    };

    // Agregar event listeners
    element.addEventListener('keydown', handleTab);
    element.addEventListener('keydown', handleEscape);
    element.addEventListener('focusout', handleFocusOut);

    // Cleanup
    return () => {
      element.removeEventListener('keydown', handleTab);
      element.removeEventListener('keydown', handleEscape);
      element.removeEventListener('focusout', handleFocusOut);

      // Devolver el foco al elemento que lo tenía antes
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isActive, ref, onClose]);
};

export default useFocusTrap;
