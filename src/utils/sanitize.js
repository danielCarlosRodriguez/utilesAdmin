import DOMPurify from 'dompurify';

/**
 * Sanitiza HTML para prevenir ataques XSS
 * @param {string} dirty - String potencialmente peligroso
 * @returns {string} - String sanitizado
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No permitir ningún tag HTML
    ALLOWED_ATTR: [], // No permitir atributos
    KEEP_CONTENT: true, // Mantener el contenido de texto
  });
};

/**
 * Sanitiza y valida URLs
 * @param {string} url - URL a validar
 * @returns {string} - URL sanitizada o string vacío si es inválida
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return '';

  const trimmedUrl = url.trim();

  try {
    const parsed = new URL(trimmedUrl);

    // Solo permitir http y https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn('Protocolo no permitido:', parsed.protocol);
      return '';
    }

    return parsed.toString();
  } catch (error) {
    console.warn('URL inválida:', error.message);
    return '';
  }
};

/**
 * Valida que una URL apunte a una imagen
 * @param {string} url - URL a validar
 * @returns {boolean} - true si es una URL de imagen válida
 */
export const isValidImageURL = (url) => {
  const sanitized = sanitizeURL(url);
  if (!sanitized) return false;

  // Validar extensión de imagen (básico)
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  return imageExtensions.test(sanitized);
};

/**
 * Valida que un string no contenga caracteres peligrosos
 * @param {string} text - Texto a validar
 * @returns {boolean} - true si el texto es seguro
 */
export const isSafeText = (text) => {
  if (!text) return true;

  // Buscar patrones peligrosos
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onload=, etc.
    /<embed/i,
    /<object/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(text));
};

/**
 * Sanitiza un objeto completo recursivamente
 * @param {Object} obj - Objeto a sanitizar
 * @returns {Object} - Objeto sanitizado
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
