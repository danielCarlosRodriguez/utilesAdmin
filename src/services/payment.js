/**
 * Payment Service
 *
 * Este servicio maneja el procesamiento de pagos.
 * Actualmente usa un mock para simular pagos exitosos.
 *
 * 🔌 INTEGRACIÓN FUTURA CON MERCADO PAGO:
 * ----------------------------------------
 * 1. Instalar SDK: npm install @mercadopago/sdk-react
 * 2. Configurar credenciales en .env:
 *    VITE_MP_PUBLIC_KEY=tu_public_key
 *    VITE_MP_ACCESS_TOKEN=tu_access_token
 * 3. Reemplazar processPayment() con llamada real a MP API
 * 4. Implementar webhooks para confirmación de pago
 * 5. Manejar redirects de success/failure/pending
 */

const PAYMENT_CONFIG = {
  // Mock configuration
  MOCK_ENABLED: true, // Cambiar a false cuando se integre MP
  MOCK_DELAY: 2000, // Simular delay de red (2 segundos)

  // Mercado Pago configuration (preparado para integración)
  MP_PUBLIC_KEY: import.meta.env.VITE_MP_PUBLIC_KEY || '',
  MP_ACCESS_TOKEN: import.meta.env.VITE_MP_ACCESS_TOKEN || '',
};

/**
 * Procesa un pago
 *
 * @param {Object} paymentData - Datos del pago
 * @param {string} paymentData.orderId - ID de la orden
 * @param {number} paymentData.amount - Monto total
 * @param {string} paymentData.method - Método de pago (mercadopago, card, cash)
 * @param {Object} paymentData.payer - Información del pagador
 * @param {Array} paymentData.items - Items de la orden
 * @returns {Promise<Object>} Resultado del pago
 */
export const processPayment = async (paymentData) => {
  if (PAYMENT_CONFIG.MOCK_ENABLED) {
    // MOCK: Simular procesamiento de pago
    return mockProcessPayment(paymentData);
  }

  // TODO: Implementar integración real con Mercado Pago
  // return mercadoPagoProcessPayment(paymentData);
};

/**
 * MOCK: Simula el procesamiento de un pago
 * @private
 */
const mockProcessPayment = async (paymentData) => {
  console.log('🔄 [MOCK] Processing payment:', paymentData);

  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, PAYMENT_CONFIG.MOCK_DELAY));

  // Simular respuesta exitosa
  const mockResponse = {
    success: true,
    paymentId: `MOCK_${Date.now()}`,
    status: 'approved', // approved, pending, rejected
    statusDetail: 'accredited',
    method: paymentData.method,
    amount: paymentData.amount,
    orderId: paymentData.orderId,
    transactionDate: new Date().toISOString(),
    message: 'Pago procesado exitosamente (MOCK)',
  };

  console.log('✅ [MOCK] Payment processed:', mockResponse);
  return mockResponse;
};

/**
 * TODO: Implementar integración real con Mercado Pago
 *
 * Ejemplo de implementación futura:
 *
 * const mercadoPagoProcessPayment = async (paymentData) => {
 *   const mp = new MercadoPago(PAYMENT_CONFIG.MP_PUBLIC_KEY);
 *
 *   const preference = {
 *     items: paymentData.items.map(item => ({
 *       title: item.name,
 *       quantity: item.quantity,
 *       unit_price: item.price,
 *       currency_id: 'ARS',
 *     })),
 *     payer: {
 *       name: paymentData.payer.name,
 *       email: paymentData.payer.email,
 *     },
 *     back_urls: {
 *       success: `${window.location.origin}/order-confirmation`,
 *       failure: `${window.location.origin}/checkout?error=payment_failed`,
 *       pending: `${window.location.origin}/checkout?status=pending`,
 *     },
 *     auto_return: 'approved',
 *     external_reference: paymentData.orderId,
 *   };
 *
 *   const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${PAYMENT_CONFIG.MP_ACCESS_TOKEN}`,
 *     },
 *     body: JSON.stringify(preference),
 *   });
 *
 *   const data = await response.json();
 *
 *   // Redirigir al checkout de Mercado Pago
 *   window.location.href = data.init_point;
 *
 *   return {
 *     success: true,
 *     preferenceId: data.id,
 *     initPoint: data.init_point,
 *   };
 * };
 */

/**
 * Verifica el estado de un pago
 *
 * @param {string} paymentId - ID del pago
 * @returns {Promise<Object>} Estado del pago
 */
export const getPaymentStatus = async (paymentId) => {
  if (PAYMENT_CONFIG.MOCK_ENABLED) {
    // MOCK: Simular consulta de estado
    return {
      success: true,
      paymentId,
      status: 'approved',
      statusDetail: 'accredited',
    };
  }

  // TODO: Implementar consulta real a Mercado Pago API
  // GET https://api.mercadopago.com/v1/payments/{id}
};

/**
 * Obtiene los métodos de pago disponibles
 *
 * @returns {Promise<Array>} Lista de métodos de pago
 */
export const getPaymentMethods = async () => {
  // Métodos de pago disponibles (preparado para MP)
  return [
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Paga con tarjeta de crédito, débito o dinero en cuenta',
      icon: '💳',
      enabled: true,
    },
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      enabled: false, // Habilitar cuando se integre procesador
    },
    {
      id: 'cash',
      name: 'Efectivo contra entrega',
      description: 'Paga en efectivo al recibir tu pedido',
      icon: '💵',
      enabled: true,
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'Transferencia o depósito bancario',
      icon: '🏦',
      enabled: false, // Habilitar si se agrega esta opción
    },
  ];
};

export default {
  processPayment,
  getPaymentStatus,
  getPaymentMethods,
};
