// Paleta de colores para categorías (usando las clases pastel-chip del CSS)
const categoryPalette = [
  'pastel-chip-1',  // Azul claro
  'pastel-chip-2',  // Verde menta
  'pastel-chip-3',  // Lavanda
  'pastel-chip-4',  // Amarillo
  'pastel-chip-5',  // Rosa
  'pastel-chip-6',  // Verde
  'pastel-chip-7',  // Celeste
  'pastel-chip-8',  // Lima
  'pastel-chip-9',  // Violeta
  'pastel-chip-10', // Rosa fuerte
];

// Cache para mantener colores consistentes entre componentes
const categoryColorMap = new Map<string, string>();
let colorIndex = 0;

/**
 * Obtiene la clase de color para una categoría.
 * Asigna un color único a cada categoría y lo mantiene consistente.
 */
export function getCategoryColorClass(category: string): string {
  if (!category) return categoryPalette[0];

  const normalized = category.toLowerCase().trim();

  if (!categoryColorMap.has(normalized)) {
    categoryColorMap.set(normalized, categoryPalette[colorIndex % categoryPalette.length]);
    colorIndex++;
  }

  return categoryColorMap.get(normalized) || categoryPalette[0];
}

/**
 * Inicializa los colores de categorías a partir de una lista de productos.
 * Esto asegura que los colores se asignen de forma consistente.
 */
export function initCategoryColors(categories: string[]): void {
  categories.forEach(category => {
    if (category && category !== 'All') {
      getCategoryColorClass(category);
    }
  });
}

/**
 * Resetea el mapa de colores (útil para testing)
 */
export function resetCategoryColors(): void {
  categoryColorMap.clear();
  colorIndex = 0;
}
