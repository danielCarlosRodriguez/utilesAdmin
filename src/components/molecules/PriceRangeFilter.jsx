import { useState, useEffect } from 'react';

/**
 * PriceRangeFilter Component - Molecule
 *
 * Filtro de rango de precios con inputs numéricos y rango visual
 *
 * @param {Object} props
 * @param {number} [props.min=0] - Precio mínimo permitido
 * @param {number} [props.max=1000000] - Precio máximo permitido
 * @param {number} [props.defaultMinValue] - Valor mínimo por defecto
 * @param {number} [props.defaultMaxValue] - Valor máximo por defecto
 * @param {Function} props.onChange - Callback cuando cambia el rango (min, max)
 * @param {string} [props.currency='ARS'] - Código de moneda
 * @param {string} [props.className] - Clases adicionales
 *
 * @example
 * <PriceRangeFilter
 *   min={0}
 *   max={500000}
 *   onChange={(min, max) => setFilters({ minPrice: min, maxPrice: max })}
 * />
 */
const PriceRangeFilter = ({
  min = 0,
  max = 1000000,
  defaultMinValue,
  defaultMaxValue,
  onChange,
  currency = 'ARS',
  className = '',
}) => {
  const [minValue, setMinValue] = useState(defaultMinValue ?? min);
  const [maxValue, setMaxValue] = useState(defaultMaxValue ?? max);

  // Actualizar valores cuando cambian los defaults
  useEffect(() => {
    if (defaultMinValue !== undefined) setMinValue(defaultMinValue);
    if (defaultMaxValue !== undefined) setMaxValue(defaultMaxValue);
  }, [defaultMinValue, defaultMaxValue]);

  // Notificar cambios con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(minValue, maxValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [minValue, maxValue, onChange]);

  // Manejar cambio en input mínimo
  const handleMinChange = (e) => {
    const value = parseInt(e.target.value) || min;
    if (value <= maxValue) {
      setMinValue(value);
    }
  };

  // Manejar cambio en input máximo
  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value) || max;
    if (value >= minValue) {
      setMaxValue(value);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Labels de rango actual */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-700">Rango de precio</span>
        <span className="text-neutral-500 text-xs">
          {formatPrice(minValue)} - {formatPrice(maxValue)}
        </span>
      </div>

      {/* Inputs numéricos */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price-min" className="block text-xs text-neutral-600 mb-1">
            Mínimo
          </label>
          <input
            id="price-min"
            type="number"
            min={min}
            max={maxValue}
            value={minValue}
            onChange={handleMinChange}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            placeholder={`Desde ${min}`}
          />
        </div>

        <div>
          <label htmlFor="price-max" className="block text-xs text-neutral-600 mb-1">
            Máximo
          </label>
          <input
            id="price-max"
            type="number"
            min={minValue}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            placeholder={`Hasta ${max}`}
          />
        </div>
      </div>

      {/* Rangos predefinidos (opcional) */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Hasta $50k', min: min, max: 50000 },
          { label: '$50k - $100k', min: 50000, max: 100000 },
          { label: '$100k - $200k', min: 100000, max: 200000 },
          { label: 'Más de $200k', min: 200000, max: max },
        ].map((range) => (
          <button
            key={range.label}
            type="button"
            onClick={() => {
              setMinValue(range.min);
              setMaxValue(range.max);
            }}
            className={`
              px-3 py-1.5 text-xs rounded-full border transition-all
              ${
                minValue === range.min && maxValue === range.max
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-500 hover:text-primary-600'
              }
            `}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Barra visual de rango */}
      <div className="relative pt-2 pb-1">
        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              marginLeft: `${((minValue - min) / (max - min)) * 100}%`,
              width: `${((maxValue - minValue) / (max - min)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
