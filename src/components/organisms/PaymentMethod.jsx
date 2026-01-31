import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCheckout } from '../../context/CheckoutContext';
import { getPaymentMethods } from '../../services/payment';

const PaymentMethod = ({ onContinue, onBack }) => {
  const { paymentMethod, setPaymentMethod, orderNotes, setOrderNotes } = useCheckout();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const availableMethods = await getPaymentMethods();
        setMethods(availableMethods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  const handleMethodChange = (methodId) => {
    setPaymentMethod(methodId);
  };

  const handleNotesChange = (e) => {
    setOrderNotes(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando métodos de pago...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>

      {/* Métodos de Pago */}
      <div className="space-y-4 mb-6">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => method.enabled && handleMethodChange(method.id)}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all
              ${
                paymentMethod === method.id
                  ? 'border-blue-600 bg-blue-50'
                  : method.enabled
                  ? 'border-gray-300 hover:border-blue-400'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {/* Radio Button */}
                <div className="mt-1">
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        paymentMethod === method.id
                          ? 'border-blue-600'
                          : 'border-gray-400'
                      }
                    `}
                  >
                    {paymentMethod === method.id && (
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>

                {/* Información del Método */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{method.icon}</span>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    {!method.enabled && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
              </div>
            </div>

            {/* Información adicional de Mercado Pago */}
            {method.id === 'mercadopago' && paymentMethod === 'mercadopago' && (
              <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Actualmente en modo de prueba (MOCK). La integración
                  real con Mercado Pago se realizará próximamente.
                </p>
              </div>
            )}

            {/* Información adicional de Efectivo */}
            {method.id === 'cash' && paymentMethod === 'cash' && (
              <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Pagarás en efectivo cuando recibas tu pedido. Asegúrate de tener el monto
                  exacto o cambio disponible.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Notas del Pedido (Opcional) */}
      <div className="mb-6">
        <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Notas del Pedido (Opcional)
        </label>
        <textarea
          id="orderNotes"
          name="orderNotes"
          value={orderNotes}
          onChange={handleNotesChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Instrucciones especiales para la entrega, preferencias de horario, etc."
        />
        <p className="text-xs text-gray-500 mt-1">
          Por ejemplo: &quot;Tocar timbre dos veces&quot; o &quot;Llamar antes de llegar&quot;
        </p>
      </div>

      {/* Seguridad */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Pago Seguro</h4>
            <p className="text-sm text-gray-600">
              Todos tus datos están protegidos con encriptación SSL de 256 bits.
              No almacenamos información de tarjetas de crédito.
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
        <button
          type="submit"
          disabled={!paymentMethod}
          className={`
            flex-1 py-3 rounded-lg font-semibold transition-colors
            ${
              paymentMethod
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Revisar Pedido
        </button>
      </div>
    </form>
  );
};

PaymentMethod.propTypes = {
  onContinue: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default PaymentMethod;
