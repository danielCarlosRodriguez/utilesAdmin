import { useState } from 'react';
import { aiAPI } from '../services/api';

/**
 * Custom Hook - useAIGeneration
 *
 * Hook para generar contenido con IA (Hugging Face)
 *
 * Funcionalidades:
 * - Generar descripciones de productos
 * - Generar keywords SEO
 * - Estados de loading y error
 *
 * @returns {Object} Estado y funciones
 * @returns {boolean} generatingDescription - Si está generando descripción
 * @returns {boolean} generatingKeywords - Si está generando keywords
 * @returns {Object|null} error - Error si ocurrió
 * @returns {Function} generateDescription - Función para generar descripción
 * @returns {Function} generateKeywords - Función para generar keywords
 *
 * @example
 * const { generateDescription, generatingDescription, error } = useAIGeneration();
 *
 * const handleGenerate = async () => {
 *   const description = await generateDescription('iPhone 14 Pro', 'Smartphones');
 *   if (description) {
 *     setFormData(prev => ({ ...prev, description }));
 *   }
 * };
 */
const useAIGeneration = () => {
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingKeywords, setGeneratingKeywords] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generar descripción del producto
   * @param {string} productName - Nombre del producto
   * @param {string} category - Categoría del producto (opcional)
   * @returns {Promise<string|null>} Descripción generada o null si hay error
   */
  const generateDescription = async (productName, category = '') => {
    if (!productName?.trim()) {
      setError({ message: 'El nombre del producto es requerido para generar la descripción' });
      return null;
    }

    try {
      setGeneratingDescription(true);
      setError(null);

      const response = await aiAPI.generateDescription(productName.trim(), category);

      if (response.success && response.data?.description) {
        return response.data.description;
      } else {
        throw new Error(response.message || 'Error al generar la descripción');
      }
    } catch (err) {
      console.error('Error generating description:', err);
      setError({
        message: err.message || 'Error al generar la descripción. Intenta nuevamente.',
      });
      return null;
    } finally {
      setGeneratingDescription(false);
    }
  };

  /**
   * Generar keywords SEO
   * @param {string} productName - Nombre del producto
   * @param {string} category - Categoría del producto (opcional)
   * @returns {Promise<string|null>} Keywords generadas (separadas por comas) o null si hay error
   */
  const generateKeywords = async (productName, category = '') => {
    if (!productName?.trim()) {
      setError({ message: 'El nombre del producto es requerido para generar las keywords' });
      return null;
    }

    try {
      setGeneratingKeywords(true);
      setError(null);

      const response = await aiAPI.generateKeywords(productName.trim(), category);

      if (response.success && response.data?.keywords) {
        // Si la API devuelve un array, convertirlo a string separado por comas
        const keywords = Array.isArray(response.data.keywords)
          ? response.data.keywords.join(', ')
          : response.data.keywords;
        return keywords;
      } else {
        throw new Error(response.message || 'Error al generar las keywords');
      }
    } catch (err) {
      console.error('Error generating keywords:', err);
      setError({
        message: err.message || 'Error al generar las keywords. Intenta nuevamente.',
      });
      return null;
    } finally {
      setGeneratingKeywords(false);
    }
  };

  return {
    generatingDescription,
    generatingKeywords,
    error,
    generateDescription,
    generateKeywords,
  };
};

export default useAIGeneration;
