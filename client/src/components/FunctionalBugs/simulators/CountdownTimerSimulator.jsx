import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Clock, CreditCard, AlertCircle } from 'lucide-react';

/**
 * FB006: Countdown Timer Goes Negative on Payment Page
 * Bug: Timer continues to negative values after reaching 00:00
 */
export default function CountdownTimerSimulator({ onBugFound }) {
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute in seconds
  const [amount] = useState(500);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      // BUG: Timer continues past zero into negative values
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePayment = () => {
    setPaymentProcessing(true);
    
    setTimeout(() => {
      // BUG: Payment processes even when timer is expired
      if (timeRemaining <= 0) {
        setPaymentResult({
          success: true,
          message: 'Payment processed successfully!',
          note: '⚠️ BUG: Payment should have been blocked - session expired!'
        });
        onBugFound?.();
      } else {
        setPaymentResult({
          success: true,
          message: 'Payment processed successfully!'
        });
      }
      setPaymentProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Payment Checkout</h2>
            <p className="text-blue-100">Complete your payment within the time limit</p>
          </div>
          <CreditCard className="h-12 w-12 opacity-80" />
        </div>
      </div>

      {/* Timer Display */}
      <div className={`p-6 rounded-lg border-2 ${
        timeRemaining < 0 
          ? 'bg-red-50 border-red-300' 
          : timeRemaining < 60 
          ? 'bg-yellow-50 border-yellow-300' 
          : 'bg-green-50 border-green-300'
      }`}>
        <div className="flex items-center justify-center space-x-4">
          <Clock className={`h-8 w-8 ${
            timeRemaining < 0 ? 'text-red-600' : timeRemaining < 60 ? 'text-yellow-600' : 'text-green-600'
          }`} />
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Session Time Remaining</p>
            <p className={`text-5xl font-bold font-mono ${
              timeRemaining < 0 ? 'text-red-600' : timeRemaining < 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {formatTime(timeRemaining)}
            </p>
            {timeRemaining < 0 && (
              <p className="text-red-600 text-sm mt-2 font-semibold">
                ⚠️ Session Expired
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Product/Service</span>
            <span className="font-semibold">Premium Subscription</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-xl">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-semibold">Credit Card •••• 4242</span>
          </div>
        </div>
      </div>

      {/* Payment Button - BUG: Should be disabled when timer expires */}
      <button
        onClick={handlePayment}
        disabled={paymentProcessing}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
          paymentProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {paymentProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>

      {/* Payment Result */}
      {paymentResult && (
        <div className={`p-4 rounded-lg border-2 ${
          paymentResult.note 
            ? 'bg-red-50 border-red-300' 
            : 'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className={`h-6 w-6 mt-0.5 ${
              paymentResult.note ? 'text-red-600' : 'text-green-600'
            }`} />
            <div className="flex-1">
              <p className={`font-semibold ${
                paymentResult.note ? 'text-red-800' : 'text-green-800'
              }`}>
                {paymentResult.message}
              </p>
              {paymentResult.note && (
                <p className="text-red-700 mt-2 text-sm">{paymentResult.note}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 Testing Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Wait for the countdown timer to reach 00:00</li>
          <li>• Observe what happens after the timer expires</li>
          <li>• Try clicking the payment button after expiry</li>
          <li>• Expected: Timer should stop at 00:00, payment should be blocked</li>
          <li>• Actual: Timer goes negative, payment still processes</li>
        </ul>
      </div>
    </div>
  );
}

CountdownTimerSimulator.propTypes = {
  onBugFound: PropTypes.func
};
