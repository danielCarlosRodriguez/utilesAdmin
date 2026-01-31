import { useToast } from '../context/ToastContext';

/**
 * ToastTestPage - Página de prueba para todos los toasts con colores exactos
 */
const ToastTestPage = () => {
  const { showToast } = useToast();

  // Los 4 toasts principales que usa la app
  const handleGreenToast = () => {
    showToast({
      type: 'success',
      title: 'Producto agregado al carrito',
    });
  };

  const handleRedToast = () => {
    showToast({
      type: 'error',
      title: 'Error al agregar al carrito',
    });
  };

  const handleYellowToast = () => {
    showToast({
      type: 'warning',
      title: 'Stock máximo alcanzado',
    });
  };

  const handleBlueToast = () => {
    showToast({
      type: 'info',
      title: 'Producto eliminado del carrito',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Prueba de Toasts
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Haz clic en cada botón para ver el toast correspondiente
        </p>

        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 space-y-6">
          {/* Toasts principales de la app */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Toasts de la Aplicación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleGreenToast}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#22C55E] text-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Verde #22C55E</div>
                  <div className="text-sm opacity-90">Producto agregado</div>
                </div>
              </button>

              <button
                onClick={handleRedToast}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EF4444] text-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Rojo #EF4444</div>
                  <div className="text-sm opacity-90">Error al agregar</div>
                </div>
              </button>

              <button
                onClick={handleYellowToast}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EAB308] text-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Amarillo #EAB308</div>
                  <div className="text-sm opacity-90">Stock máximo</div>
                </div>
              </button>

              <button
                onClick={handleBlueToast}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#3B82F6] text-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Azul #3B82F6</div>
                  <div className="text-sm opacity-90">Producto eliminado</div>
                </div>
              </button>
            </div>
          </div>

          {/* Paleta completa de colores */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Paleta Completa de Colores
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1F2937] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Negro/Gris Oscuro</div>
                  <div className="text-sm opacity-75">#1F2937</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#6B7280] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Gris</div>
                  <div className="text-sm opacity-75">#6B7280</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EF4444] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Rojo (Error)</div>
                  <div className="text-sm opacity-75">#EF4444</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EAB308] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Amarillo (Warning)</div>
                  <div className="text-sm opacity-75">#EAB308</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#22C55E] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Verde (Success)</div>
                  <div className="text-sm opacity-75">#22C55E</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#3B82F6] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Azul (Info)</div>
                  <div className="text-sm opacity-75">#3B82F6</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#6366F1] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Índigo</div>
                  <div className="text-sm opacity-75">#6366F1</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#A855F7] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Púrpura</div>
                  <div className="text-sm opacity-75">#A855F7</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EC4899] text-white shadow-md">
                <div className="w-8 h-8 rounded bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-medium">Rosa</div>
                  <div className="text-sm opacity-75">#EC4899</div>
                </div>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Instrucciones
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Haz clic en los botones de la sección "Toasts de la Aplicación" para ver las notificaciones</li>
              <li>Los toasts aparecerán en la esquina superior derecha</li>
              <li>Cada toast tiene el color exacto especificado en formato hexadecimal</li>
              <li>Los toasts se cierran automáticamente después de 5 segundos</li>
              <li>Puedes cerrar manualmente con el botón X</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastTestPage;
