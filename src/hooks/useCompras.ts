import { useCallback, useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;
const DATABASE = 'utiles';
const COLLECTION = 'compras';

type RawMongoCompra = {
  _id?: string | { $oid?: string };
  idCompra?: number;
  proveedor?: string;
  gastosExtras?: {
    envio?: number;
    extra1?: number;
    extra2?: number;
    extraBolsa?: number;
  };
  resumen?: {
    totalFactura?: number;
    totalFacturaFisica?: number;
    totalCompra?: number;
    totalInversion?: number;
    totalGanancia?: number;
    totalFacturado?: number;
    diferenciaFactura?: number;
    markup?: number;
    margenUtilidad?: number;
  };
  productos?: Array<Record<string, unknown>>;
  totalItems?: number;
  totalUnidades?: number;
  createdAt?: string;
};

export type Compra = {
  _id?: string;
  idCompra?: number;
  proveedor: string;
  gastosExtras: {
    envio: number;
    extra1: number;
    extra2: number;
    extraBolsa: number;
  };
  resumen: {
    totalFactura: number;
    totalFacturaFisica: number;
    totalCompra: number;
    totalInversion: number;
    totalGanancia: number;
    totalFacturado: number;
    diferenciaFactura: number;
    markup: number;
    margenUtilidad: number;
  };
  productos: Array<Record<string, unknown>>;
  totalItems?: number;
  totalUnidades?: number;
  createdAt?: string;
};

const getId = (value?: string | { $oid?: string }) => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.$oid;
};

const normalizeCompra = (item: RawMongoCompra): Compra => {
  return {
    _id: getId(item._id),
    idCompra: item.idCompra,
    proveedor: item.proveedor ?? '',
    gastosExtras: {
      envio: Number(item.gastosExtras?.envio ?? 0),
      extra1: Number(item.gastosExtras?.extra1 ?? 0),
      extra2: Number(item.gastosExtras?.extra2 ?? 0),
      extraBolsa: Number(item.gastosExtras?.extraBolsa ?? 0)
    },
    resumen: {
      totalFactura: Number(item.resumen?.totalFactura ?? 0),
      totalFacturaFisica: Number(item.resumen?.totalFacturaFisica ?? 0),
      totalCompra: Number(item.resumen?.totalCompra ?? 0),
      totalInversion: Number(item.resumen?.totalInversion ?? 0),
      totalGanancia: Number(item.resumen?.totalGanancia ?? 0),
      totalFacturado: Number(item.resumen?.totalFacturado ?? 0),
      diferenciaFactura: Number(item.resumen?.diferenciaFactura ?? 0),
      markup: Number(item.resumen?.markup ?? 0),
      margenUtilidad: Number(item.resumen?.margenUtilidad ?? 0)
    },
    productos: Array.isArray(item.productos) ? item.productos : [],
    totalItems: Number(item.totalItems ?? 0),
    totalUnidades: Number(item.totalUnidades ?? 0),
    createdAt: item.createdAt
  };
};

export const useCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompras = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const data: RawMongoCompra[] = result.data || result;
      setCompras(data.map(normalizeCompra));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar compras';
      setError(message);
      console.error('useCompras error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  return { compras, isLoading, error, refetch: fetchCompras };
};
