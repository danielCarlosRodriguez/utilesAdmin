import PropTypes from 'prop-types';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Información de Envío', icon: '📦' },
    { number: 2, title: 'Método de Pago', icon: '💳' },
    { number: 3, title: 'Confirmación', icon: '✅' },
  ];

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  transition-all duration-300 border-2
                  ${
                    currentStep > step.number
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-blue-600 border-blue-600 text-white scale-110'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                  }
                `}
              >
                {currentStep > step.number ? '✓' : step.icon}
              </div>

              {/* Step Title */}
              <span
                className={`
                  mt-2 text-sm font-medium text-center absolute top-14 whitespace-nowrap
                  ${
                    currentStep >= step.number
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }
                `}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 relative">
                <div className="absolute inset-0 bg-gray-300 rounded"></div>
                <div
                  className={`
                    absolute inset-0 rounded transition-all duration-500
                    ${
                      currentStep > step.number
                        ? 'bg-green-500 w-full'
                        : 'bg-gray-300 w-0'
                    }
                  `}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

CheckoutSteps.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default CheckoutSteps;
