import { useNavigate } from 'react-router-dom';
import { useCompras } from '../hooks/useCompras.ts';

const formatNumber = (value: number, decimals = 2) => {
  return new Intl.NumberFormat('es-UY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

const getItemsCount = (value?: number) => (Number.isFinite(value) ? value : 0);

const getUnitsCount = (value?: number) => (Number.isFinite(value) ? value : 0);

const ComprasList = () => {
  const { compras, isLoading, error, refetch } = useCompras();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Listado de compras</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/compras')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Nueva compra
          </button>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"
          >
            Recargar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-100 text-slate-600 border-b border-gray-200">
            <tr className="text-center">
              <th className="px-3 py-2 border-r border-gray-200">ID</th>
              <th className="px-3 py-2 border-r border-gray-200">Proveedor</th>
              <th className="px-3 py-2 border-r border-gray-200">Cantidad de items</th>
              <th className="px-3 py-2 border-r border-gray-200">Cantidad de unidades</th>
              <th className="px-3 py-2 border-r border-gray-200">Total compra</th>
              <th className="px-3 py-2 border-r border-gray-200">Total inversión</th>
              <th className="px-3 py-2 border-r border-gray-200">Markup</th>
              <th className="px-3 py-2">Diferencia</th>
              <th className="px-3 py-2">Ver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-sm text-slate-500">
                  Cargando compras...
                </td>
              </tr>
            ) : compras.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-sm text-slate-500">
                  No hay compras registradas.
                </td>
              </tr>
            ) : (
              [...compras]
                .sort((a, b) => (a.idCompra ?? 0) - (b.idCompra ?? 0))
                .map((compra) => (
                <tr key={compra._id ?? compra.idCompra} className="bg-white text-center">
                  <td className="px-3 py-2 border-r border-gray-200">{compra.idCompra ?? '-'}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-left">{compra.proveedor || '-'}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">
                    {getItemsCount(compra.totalItems)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">
                    {formatNumber(getUnitsCount(compra.totalUnidades), 0)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    $ {formatNumber(compra.resumen.totalCompra)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    $ {formatNumber(compra.resumen.totalInversion)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    {formatNumber(compra.resumen.markup)} %
                  </td>
                  <td className="px-3 py-2 text-center">
                    $ {formatNumber(compra.resumen.diferenciaFactura)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/compras', { state: { compra } })}
                      className="inline-flex items-center justify-center rounded-md p-1 text-slate-600 hover:bg-slate-100"
                      title="Ver compra"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComprasList;
