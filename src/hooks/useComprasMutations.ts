import { useCallback, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;
const DATABASE = 'utiles';
const COLLECTION = 'compras';

export interface CompraPayload {
  idCompra: number;
  proveedor: string;
  totalItems?: number;
  totalUnidades?: number;
  gastosExtras: {
    envio: number;
    extra1: number;
    extra2: number;
    extraBolsa?: number;
  };
  resumen: {
    totalFacturaFisica?: number;
    totalCompra?: number;
    totalFacturado?: number;
    diferenciaFactura?: number;
    totalFactura: number;
    totalInversion: number;
    totalGanancia: number;
    markup: number;
    margenUtilidad: number;
  };
  productos: Array<Record<string, unknown>>;
}

type RawMongoCompra = {
  _id?: string | { $oid?: string };
};

const getId = (value?: string | { $oid?: string }) => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.$oid;
};

function getResponseData<T>(result: { data?: T } | T): T {
  return (result as { data?: T }).data ?? (result as T);
}

export function useCreateCompra(): {
  isLoading: boolean;
  error: string | null;
  createCompra: (payload: CompraPayload) => Promise<string | null>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCompra = useCallback(async (payload: CompraPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const created = getResponseData<RawMongoCompra>(result);
      const createdId = getId(created?._id);
      if (createdId) return createdId;

      const lookupResponse = await fetch(
        `${BACKEND_URL}/api/${DATABASE}/${COLLECTION}?idCompra=${payload.idCompra}`
      );
      if (!lookupResponse.ok) {
        return null;
      }
      const lookupResult = await lookupResponse.json();
      const data = getResponseData<RawMongoCompra[] | RawMongoCompra>(lookupResult);
      const match = Array.isArray(data) ? data[0] : data;
      return getId(match?._id) ?? null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar compra';
      setError(message);
      console.error('useCreateCompra error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, createCompra };
}

export function useUpdateCompra(options?: {
  method?: 'PATCH' | 'PUT';
}): {
  isLoading: boolean;
  error: string | null;
  updateCompra: (id: string, payload: CompraPayload) => Promise<boolean>;
} {
  const method = options?.method || 'PATCH';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCompra = useCallback(async (id: string, payload: CompraPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}/${id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar compra';
      setError(message);
      console.error('useUpdateCompra error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [method]);

  return { isLoading, error, updateCompra };
}
