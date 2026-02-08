import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCreateCompra, useUpdateCompra } from '../hooks/useComprasMutations.ts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Competencia = {
  donMateo: string;
  geant: string;
  mosca: string;
  ti: string;
  aldo: string;
  lencina: string;
  clon: string;
  jarque: string;
  ardo: string;
  districomp: string;
  diego: string;
};

type CompraRow = {
  refid: string;
  producto: string;
  marca: string;
  cantidad: string;
  total: string;
  precioVenta: string;
  competencia: Competencia;
  cantidadVendida: string;
};

const emptyCompetencia: Competencia = {
  donMateo: '',
  geant: '',
  mosca: '',
  ti: '',
  aldo: '',
  lencina: '',
  clon: '',
  jarque: '',
  ardo: '',
  districomp: '',
  diego: ''
};

const emptyRow = (): CompraRow => ({
  refid: '',
  producto: '',
  marca: '',
  cantidad: '',
  total: '',
  precioVenta: '',
  competencia: { ...emptyCompetencia },
  cantidadVendida: ''
});

const parseNumber = (value: string) => {
  const raw = value.trim();
  if (!raw) return 0;
  const normalized = raw.includes(',')
    ? raw.replace(/\./g, '').replace(',', '.')
    : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value: number, decimals = 2) => {
  return new Intl.NumberFormat('es-UY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

const getMargenClass = (value: number) => {
  if (value < 20) return 'bg-red-100';
  if (value < 30) return 'bg-orange-100';
  if (value < 40) return 'bg-yellow-100';
  if (value < 60) return 'bg-green-100';
  return 'bg-sky-100';
};

const Compras = () => {
  const { createCompra, isLoading: isCreating, error: createError } = useCreateCompra();
  const { updateCompra, isLoading: isUpdating, error: updateError } = useUpdateCompra();
  const location = useLocation();
  const [proveedor, setProveedor] = useState('');
  const [envio, setEnvio] = useState('');
  const [extra1, setExtra1] = useState('');
  const [extra2, setExtra2] = useState('');
  const [extraBolsa, setExtraBolsa] = useState('');
  const [totalFacturaFisica, setTotalFacturaFisica] = useState('');
  const [rows, setRows] = useState<CompraRow>([emptyRow(), emptyRow()]);
  const [currentCompraId, setCurrentCompraId] = useState<string | null>(null);

  useEffect(() => {
    const stateCompra = (location.state as { compra?: any } | null)?.compra;
    if (!stateCompra) return;

    const productos = Array.isArray(stateCompra.productos) ? stateCompra.productos : [];
    const mappedRows = productos.length > 0
      ? productos.map((item: any) => ({
        refid: String(item.refid ?? ''),
        producto: String(item.producto ?? ''),
        marca: String(item.marca ?? ''),
        cantidad: item.cantidad !== undefined ? String(item.cantidad) : '',
        total: item.total !== undefined ? String(item.total) : '',
        precioVenta: item.precioVenta !== undefined ? String(item.precioVenta) : '',
        competencia: {
          donMateo: String(item.competencia?.donMateo ?? ''),
          geant: String(item.competencia?.geant ?? ''),
          mosca: String(item.competencia?.mosca ?? ''),
          ti: String(item.competencia?.ti ?? ''),
          aldo: String(item.competencia?.aldo ?? ''),
          lencina: String(item.competencia?.lencina ?? ''),
          clon: String(item.competencia?.clon ?? ''),
          jarque: String(item.competencia?.jarque ?? ''),
          ardo: String(item.competencia?.ardo ?? ''),
          districomp: String(item.competencia?.districomp ?? ''),
          diego: String(item.competencia?.diego ?? '')
        },
        cantidadVendida: item.cantidadVendida !== undefined ? String(item.cantidadVendida) : ''
      }))
      : [emptyRow(), emptyRow()];

    setProveedor(String(stateCompra.proveedor ?? ''));
    setEnvio(String(stateCompra.gastosExtras?.envio ?? ''));
    setExtra1(String(stateCompra.gastosExtras?.extra1 ?? ''));
    setExtra2(String(stateCompra.gastosExtras?.extra2 ?? ''));
    setExtraBolsa(String(stateCompra.gastosExtras?.extraBolsa ?? ''));
    setTotalFacturaFisica(String(stateCompra.resumen?.totalFacturaFisica ?? ''));
    setRows(mappedRows);

    if (stateCompra.idCompra) {
      setNextIdCompra(Number(stateCompra.idCompra));
    }
    if (stateCompra._id) {
      setCurrentCompraId(String(stateCompra._id));
    }
  }, [location.state]);

  const gastosExtrasDistribuibles = useMemo(() => {
    return parseNumber(envio) + parseNumber(extra1) + parseNumber(extra2);
  }, [envio, extra1, extra2]);

  const gastosExtrasParaDistribuir = useMemo(() => {
    return gastosExtrasDistribuibles + parseNumber(extraBolsa);
  }, [gastosExtrasDistribuibles, extraBolsa]);

  const computedRows = useMemo(() => {
    const totalUnidades = rows.reduce((sum, row) => sum + parseNumber(row.cantidad), 0);
    const extraPorUnidad = totalUnidades > 0 ? gastosExtrasParaDistribuir / totalUnidades : 0;

    return rows.map((row) => {
      const cantidad = parseNumber(row.cantidad);
      const totalBase = parseNumber(row.total);
      const costoUnit = cantidad > 0 ? totalBase / cantidad : 0;
      const precioVenta = parseNumber(row.precioVenta);
      const total = totalBase;
      const totalConGastos = totalBase + (extraPorUnidad * cantidad);
      const costoFinalUnidad = cantidad > 0 ? totalConGastos / cantidad : 0;
      const margenGanancia = precioVenta > 0
        ? ((precioVenta - costoFinalUnidad) / precioVenta) * 100
        : 0;
      const ventaMinimaRecuperar = precioVenta > 0
        ? Math.ceil(totalConGastos / precioVenta)
        : 0;
      const gananciaUnidad = precioVenta - costoFinalUnidad;
      const cantidadVendida = parseNumber(row.cantidadVendida);
      const gananciaTotal = gananciaUnidad * cantidadVendida;
      const gananciaTotalProyectada = gananciaUnidad * cantidad;
      const stock = cantidad - cantidadVendida;
      const ingresos = cantidadVendida * precioVenta;

      return {
        total,
        totalConGastos,
        costoUnit,
        costoFinalUnidad,
        margenGanancia,
        ventaMinimaRecuperar,
        gananciaUnidad,
        gananciaTotal,
        gananciaTotalProyectada,
        stock,
        cantidadVendida,
        ingresos
      };
    });
  }, [rows, gastosExtrasParaDistribuir]);

  const totalCompra = useMemo(() => {
    const subtotal = rows.reduce((sum, row) => sum + parseNumber(row.total), 0);
    return subtotal + parseNumber(extraBolsa);
  }, [rows, extraBolsa]);

  const totalInversion = totalCompra + gastosExtrasDistribuibles;
  const totalFacturaFisicaValue = parseNumber(totalFacturaFisica);
  const diferenciaFactura = totalCompra - totalFacturaFisicaValue;

  const totalFacturadoValue = useMemo(() => {
    return computedRows.reduce((sum, row) => sum + row.ingresos, 0);
  }, [computedRows]);
  const totalGananciaProyectada = useMemo(() => {
    return computedRows.reduce((sum, row) => sum + row.gananciaTotalProyectada, 0);
  }, [computedRows]);
  const totalGanancia = totalGananciaProyectada;
  const markup = totalInversion > 0 ? (totalGanancia / totalInversion) * 100 : 0;
  const margenUtilidad = (totalInversion + totalGanancia) > 0
    ? (totalGanancia / (totalInversion + totalGanancia)) * 100
    : 0;

  const totalItems = useMemo(() => {
    return rows.filter((row) =>
      row.producto.trim()
      || row.marca.trim()
      || row.refid.trim()
      || row.cantidad.trim()
      || row.total.trim()
    ).length;
  }, [rows]);

  const totalUnidades = useMemo(() => {
    return rows.reduce((sum, row) => sum + parseNumber(row.cantidad), 0);
  }, [rows]);

  const handleRowChange = (index: number, field: keyof CompraRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCompetenciaChange = (
    index: number,
    field: keyof Competencia,
    value: string
  ) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        competencia: {
          ...updated[index].competencia,
          [field]: value
        }
      };
      return updated;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const handlePasteColumn = (startIndex: number, field: keyof CompraRow, text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    setRows((prev) => {
      const next = [...prev];
      const requiredLength = startIndex + lines.length;
      while (next.length < requiredLength) {
        next.push(emptyRow());
      }
      lines.forEach((line, offset) => {
        const rowIndex = startIndex + offset;
        next[rowIndex] = {
          ...next[rowIndex],
          [field]: line
        };
      });
      return next;
    });
  };

  const [nextIdCompra, setNextIdCompra] = useState(100);
  const refreshNextIdFromMongo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/utiles/compras`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      const data = (result.data || result) as Array<{ idCompra?: number }>;
      const maxId = data.reduce((max, item) => {
        const value = Number(item.idCompra ?? 0);
        return Number.isFinite(value) ? Math.max(max, value) : max;
      }, 99);
      setNextIdCompra(maxId + 1);
    } catch (err) {
      console.warn('No se pudo leer el último id de compras', err);
      setNextIdCompra(100);
    }
  };

  useEffect(() => {
    if (currentCompraId) return;
    refreshNextIdFromMongo();
  }, [currentCompraId]);

  const handleSave = async () => {
    const idCompra = nextIdCompra;
    const payload = {
      idCompra,
      proveedor: proveedor.trim(),
      totalItems,
      totalUnidades,
      gastosExtras: {
        envio: parseNumber(envio),
        extra1: parseNumber(extra1),
        extra2: parseNumber(extra2),
        extraBolsa: parseNumber(extraBolsa)
      },
      resumen: {
        totalFactura: totalCompra,
        totalFacturaFisica: totalFacturaFisicaValue,
        totalCompra,
        totalInversion,
        totalGanancia,
        totalFacturado: totalFacturadoValue,
        diferenciaFactura,
        markup,
        margenUtilidad
      },
      productos: rows.map((row, index) => ({
        refid: row.refid,
        producto: row.producto,
        marca: row.marca,
        cantidad: parseNumber(row.cantidad),
        costoUnit: computedRows[index].costoUnit,
        precioVenta: parseNumber(row.precioVenta),
        competencia: row.competencia,
        cantidadVendida: parseNumber(row.cantidadVendida),
        ...computedRows[index]
      }))
    };

    if (currentCompraId) {
      await updateCompra(currentCompraId, payload);
      return;
    }

    const createdId = await createCompra(payload);
    if (createdId) {
      setNextIdCompra(idCompra + 1);
      setCurrentCompraId(createdId);
    }
  };

  const handleNewCompra = () => {
    setProveedor('');
    setEnvio('');
    setExtra1('');
    setExtra2('');
    setExtraBolsa('');
    setTotalFacturaFisica('');
    setRows([emptyRow(), emptyRow()]);
    setCurrentCompraId(null);
    refreshNextIdFromMongo();
  };

  const [hideColumns, setHideColumns] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Compras</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewCompra}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"
          >
            Nueva compra
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          >
            {isCreating || isUpdating ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        ID Compra: <span className="font-semibold text-slate-700">{nextIdCompra}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-5 mb-4">
        <label className="text-sm text-slate-600">
          Nombre del proveedor
          <input
            type="text"
            value={proveedor}
            onChange={(event) => setProveedor(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-blue-50 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-slate-600">
          Gastos extras: Envío
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
            <input
              type="number"
              value={envio}
              onChange={(event) => setEnvio(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-blue-50 py-2 pl-6 pr-3 text-sm"
              min="0"
            />
          </div>
        </label>
        <label className="text-sm text-slate-600">
          Gastos extras: Extra 1
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
            <input
              type="number"
              value={extra1}
              onChange={(event) => setExtra1(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-blue-50 py-2 pl-6 pr-3 text-sm"
              min="0"
            />
          </div>
        </label>
        <label className="text-sm text-slate-600">
          Gastos extras: Extra 2
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
            <input
              type="number"
              value={extra2}
              onChange={(event) => setExtra2(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-blue-50 py-2 pl-6 pr-3 text-sm"
              min="0"
            />
          </div>
        </label>
        <label className="text-sm text-slate-600">
          Gasto Extra tipo &quot;Bolsa&quot;
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
            <input
              type="number"
              value={extraBolsa}
              onChange={(event) => setExtraBolsa(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-blue-50 py-2 pl-6 pr-3 text-sm"
              min="0"
            />
          </div>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <label className="text-sm text-slate-600">
          Total de factura física
          <input
            type="number"
            value={totalFacturaFisica}
            onChange={(event) => setTotalFacturaFisica(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-blue-50 px-3 py-2 text-sm"
            min="0"
          />
        </label>
        <div className="text-sm text-slate-600">
          Total de compra
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
            $ {formatNumber(totalCompra)}
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Diferencia
          <div
            className={`mt-1 rounded-lg border px-3 py-2 text-sm ${
              diferenciaFactura < 0
                ? 'border-red-200 bg-red-50 text-red-700'
                : diferenciaFactura > 0
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-gray-200 text-slate-700'
            }`}
          >
            $ {formatNumber(diferenciaFactura)}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <div className="text-sm text-slate-600">
          Total inversión
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
            $ {formatNumber(totalInversion)}
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Total facturado
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
            $ {formatNumber(totalFacturadoValue)}
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Total ganancia proyectada
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
            $ {formatNumber(totalGanancia)}
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Markup
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
            {formatNumber(markup)} %
          </div>
          <div className="mt-2 text-[11px] text-slate-500 text-center">
            Por c/$100 invertido, ganas $ <span className="font-semibold">{formatNumber(markup)}</span>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Margen de utilidad
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
            {formatNumber(margenUtilidad)} %
          </div>
          <div className="mt-2 text-[11px] text-slate-500 text-center">
            De c/$100 vendido, $ <span className="font-semibold">{formatNumber(margenUtilidad)}</span> son ganancias
          </div>
        </div>
      </div>

      {(createError || updateError) && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {createError || updateError}
        </div>
      )}

      <div className="mb-2 flex items-center justify-start">
        <button
          type="button"
          onClick={() => setHideColumns((prev) => !prev)}
          className="inline-flex items-center rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-gray-50"
        >
          {hideColumns ? 'Mostrar Columnas' : 'Ocultar Columnas'}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-100 text-slate-600 border-b border-gray-200">
            <tr className="text-center">
              {!hideColumns && (
                <th className="px-3 py-2 border-r border-gray-200">Refid</th>
              )}
              <th className="px-3 py-2 border-r border-gray-200">Producto</th>
              {!hideColumns && (
                <th className="px-3 py-2 border-r border-gray-200">Marca</th>
              )}
              {!hideColumns && (
                <th className="px-3 py-2 border-r border-gray-200">Cantidad comprada</th>
              )}
              <th className="px-3 py-2 border-r border-gray-200 min-w-[120px] whitespace-normal leading-tight">Costo por unidad</th>
              {!hideColumns && (
                <th className="px-3 py-2 border-r border-gray-200">Total</th>
              )}
              {!hideColumns && (
                <th className="px-3 py-2 border-r border-gray-200 min-w-[120px] whitespace-normal leading-tight">Total con gastos extras</th>
              )}
              <th className="px-3 py-2 border-r border-gray-200 min-w-[120px] whitespace-normal leading-tight">Costo final por unidad</th>
              <th className="px-3 py-2 border-r border-gray-200">Precio venta al público</th>
              <th className="px-3 py-2 border-r border-gray-200 min-w-[170px] whitespace-nowrap">
                <div>% Margen ganancia</div>
                <div className="mt-1 flex items-center justify-center "> 
                  <span className="h-2 w-3   bg-red-500" /> 
                  <span className="h-2 w-3   bg-orange-400" /> 
                  <span className="h-2 w-3   bg-yellow-200" /> 
                  <span className="h-2 w-3   bg-green-500" /> 
                  <span className="h-2 w-3   bg-sky-500" /> 
                </div>
              </th>
              <th className="px-3 py-2 border-r border-gray-200">Ganancia unidad</th>
              <th className="px-3 py-2 border-r border-gray-200">Ganancia total</th>
              <th className="px-3 py-2 border-r border-gray-200 min-w-[120px] whitespace-normal leading-tight">Venta mínima recuperar</th>
              <th className="px-3 py-2 border-r border-gray-200">Don Mateo</th>
              <th className="px-3 py-2 border-r border-gray-200">Géant</th>
              <th className="px-3 py-2 border-r border-gray-200">Mosca</th>
              <th className="px-3 py-2 border-r border-gray-200">TI</th>
              <th className="px-3 py-2 border-r border-gray-200">Aldo</th>
              <th className="px-3 py-2 border-r border-gray-200">Lencina</th>
              <th className="px-3 py-2 border-r border-gray-200">Clon</th>
              <th className="px-3 py-2 border-r border-gray-200">Jarque</th>
              <th className="px-3 py-2 border-r border-gray-200">Ardo</th>
              <th className="px-3 py-2 border-r border-gray-200">Districomp</th>
              <th className="px-3 py-2 border-r border-gray-200">Diego</th>
              <th className="px-3 py-2 border-r border-gray-200">Stock</th>
              <th className="px-3 py-2 border-r border-gray-200">Cantidad vendida</th>
              <th className="px-3 py-2">Ingresos</th>
              <th className="px-3 py-2">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => {
              const computed = computedRows[index];
              return (
                <tr key={index} className="bg-white">
                  {!hideColumns && (
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input
                        value={row.refid}
                        onChange={(event) => handleRowChange(index, 'refid', event.target.value)}
                        className="w-20 rounded border border-gray-200 bg-blue-100 px-2 py-1"
                      />
                    </td>
                  )}
                  <td className="px-3 py-2 border-r border-gray-200">
                    <input
                      value={row.producto}
                      onChange={(event) => handleRowChange(index, 'producto', event.target.value)}
                      onPaste={(event) => {
                        const text = event.clipboardData.getData('text');
                        if (text.includes('\n')) {
                          event.preventDefault();
                          handlePasteColumn(index, 'producto', text);
                        }
                      }}
                      className="w-48 rounded border border-gray-200 bg-blue-100 px-2 py-1"
                    />
                  </td>
                  {!hideColumns && (
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input
                        value={row.marca}
                        onChange={(event) => handleRowChange(index, 'marca', event.target.value)}
                        onPaste={(event) => {
                          const text = event.clipboardData.getData('text');
                          if (text.includes('\n')) {
                            event.preventDefault();
                            handlePasteColumn(index, 'marca', text);
                          }
                        }}
                        className="w-28 rounded border border-gray-200 bg-blue-100 px-2 py-1"
                      />
                    </td>
                  )}
                  {!hideColumns && (
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input
                        type="number"
                        value={row.cantidad}
                        onChange={(event) => handleRowChange(index, 'cantidad', event.target.value)}
                        onPaste={(event) => {
                          const text = event.clipboardData.getData('text');
                          if (text.includes('\n')) {
                            event.preventDefault();
                            handlePasteColumn(index, 'cantidad', text);
                          }
                        }}
                        className="w-24 rounded border border-gray-200 bg-blue-100 px-2 py-1 text-right"
                      />
                    </td>
                  )}
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    $ {formatNumber(computed.costoUnit)}
                  </td>
                  {!hideColumns && (
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input
                        type="text"
                        value={row.total}
                        onChange={(event) => handleRowChange(index, 'total', event.target.value)}
                        onPaste={(event) => {
                          const text = event.clipboardData.getData('text');
                          if (text.includes('\n')) {
                            event.preventDefault();
                            handlePasteColumn(index, 'total', text);
                          }
                        }}
                        className="w-24 rounded border border-gray-200 bg-blue-100 px-2 py-1 text-right"
                      />
                    </td>
                  )}
                  {!hideColumns && (
                    <td className="px-3 py-2 border-r border-gray-200 text-right min-w-[120px]">
                      $ {formatNumber(computed.totalConGastos)}
                    </td>
                  )}
                  <td className="px-3 py-2 border-r border-gray-200 text-right min-w-[120px]">
                    $ {formatNumber(computed.costoFinalUnidad)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 bg-yellow-50">
                    <input
                      type="number"
                      value={row.precioVenta}
                      onChange={(event) => handleRowChange(index, 'precioVenta', event.target.value)}
                      onPaste={(event) => {
                        const text = event.clipboardData.getData('text');
                        if (text.includes('\n')) {
                          event.preventDefault();
                          handlePasteColumn(index, 'precioVenta', text);
                        }
                      }}
                      className="w-24 rounded border border-gray-200 bg-yellow-50 px-2 py-1 text-right"
                    />
                  </td>
                  <td
                    className={`px-3 py-2 border-r border-gray-200 text-right ${getMargenClass(
                      computed.margenGanancia
                    )}`}
                  >
                    {formatNumber(computed.margenGanancia)} %
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    $ {formatNumber(computed.gananciaUnidad)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    $ {formatNumber(computed.gananciaTotal)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    {formatNumber(computed.ventaMinimaRecuperar, 0)}
                  </td>
                  {Object.entries(row.competencia).map(([key, value]) => (
                    <td key={key} className="px-3 py-2 border-r border-gray-200">
                      <input
                        type="number"
                        value={value}
                        onChange={(event) => handleCompetenciaChange(index, key as keyof Competencia, event.target.value)}
                        className="w-24 rounded border border-gray-200 bg-blue-100 px-2 py-1 text-right"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 border-r border-gray-200 text-right">
                    {computed.stock.toFixed(0)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200">
                    <input
                      type="number"
                      value={row.cantidadVendida}
                      onChange={(event) => handleRowChange(index, 'cantidadVendida', event.target.value)}
                      className="w-24 rounded border border-gray-200 bg-blue-100 px-2 py-1 text-right"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">$ {formatNumber(computed.ingresos)}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="inline-flex items-center justify-center rounded-md p-1 text-red-600 hover:bg-red-50"
                      title="Eliminar fila"
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
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"
        >
          + Agregar
        </button>
        <div className="flex flex-1 flex-wrap justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Cantidad de items {formatNumber(totalItems, 0)}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Cantidad de productos {formatNumber(totalUnidades, 0)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compras;
