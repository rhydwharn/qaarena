import { useState } from 'react';
import PropTypes from 'prop-types';
import { DollarSign, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * FB015: Refund Amount Exceeds Original Payment
 * Bug: System allows refund greater than original payment
 */
export default function RefundSimulator({ onBugFound }) {
  const [originalPayment] = useState(100);
  const [customerBalance, setCustomerBalance] = useState(500);
  const [merchantBalance, setMerchantBalance] = useState(1000);
  const [refundAmount, setRefundAmount] = useState('');
  const [refunds, setRefunds] = useState([]);
  const [message, setMessage] = useState(null);

  const totalRefunded = refunds.reduce((sum, r) => sum + r.amount, 0);
  const remainingRefundable = originalPayment - totalRefunded;

  const handleRefund = () => {
    const amount = parseFloat(refundAmount);

    if (!amount || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid refund amount' });
      return;
    }

    // BUG: No validation against original payment amount!
    // Should check: if (amount > originalPayment || amount > remainingRefundable)
    
    if (amount > merchantBalance) {
      setMessage({ type: 'error', text: 'Merchant has insufficient funds for refund' });
      return;
    }

    // Process refund without validation
    const newRefund = {
      id: Date.now(),
      amount,
      timestamp: new Date().toLocaleTimeString(),
      customerBalanceBefore: customerBalance,
      merchantBalanceBefore: merchantBalance
    };

    setRefunds([...refunds, newRefund]);
    setCustomerBalance(prev => prev + amount);
    setMerchantBalance(prev => prev - amount);
    setRefundAmount('');

    if (amount > originalPayment || totalRefunded + amount > originalPayment) {
      setMessage({
        type: 'bug',
        text: `🐛 BUG: Refund of $${amount.toFixed(2)} exceeds original payment of $${originalPayment.toFixed(2)}!`
      });
      onBugFound?.();
    } else {
      setMessage({
        type: 'success',
        text: `✅ Refund of $${amount.toFixed(2)} processed successfully`
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Refund Processing System</h2>
            <p className="text-teal-100">Process customer refunds</p>
          </div>
          <RotateCcw className="h-12 w-12 opacity-80" />
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-blue-300 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600 mb-1">Original Payment</p>
          <p className="text-2xl font-bold text-blue-600">${originalPayment.toFixed(2)}</p>
        </div>
        <div className="bg-white border-2 border-orange-300 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600 mb-1">Total Refunded</p>
          <p className={`text-2xl font-bold ${
            totalRefunded > originalPayment ? 'text-red-600' : 'text-orange-600'
          }`}>
            ${totalRefunded.toFixed(2)}
          </p>
          {totalRefunded > originalPayment && (
            <p className="text-xs text-red-600 mt-1">⚠️ Exceeds original!</p>
          )}
        </div>
        <div className="bg-white border-2 border-green-300 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600 mb-1">Remaining Refundable</p>
          <p className={`text-2xl font-bold ${
            remainingRefundable < 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            ${Math.max(0, remainingRefundable).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Balance Display */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Balance</p>
              <p className="text-2xl font-bold text-green-700">${customerBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Merchant Balance</p>
              <p className="text-2xl font-bold text-purple-700">${merchantBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Refund Form */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Process Refund</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Original payment: ${originalPayment.toFixed(2)} | Remaining: ${Math.max(0, remainingRefundable).toFixed(2)}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 100, 150].map(amount => (
              <button
                key={amount}
                onClick={() => setRefundAmount(amount.toString())}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  amount > originalPayment
                    ? 'bg-red-100 hover:bg-red-200 text-red-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefund}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Process Refund
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border-2 ${
          message.type === 'bug' 
            ? 'bg-red-50 border-red-300' 
            : message.type === 'error'
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-start space-x-3">
            {message.type === 'bug' || message.type === 'error' ? (
              <AlertCircle className={`h-6 w-6 mt-0.5 ${
                message.type === 'bug' ? 'text-red-600' : 'text-yellow-600'
              }`} />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            )}
            <p className={`text-sm ${
              message.type === 'bug' 
                ? 'text-red-700' 
                : message.type === 'error'
                ? 'text-yellow-700'
                : 'text-green-700'
            }`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Refund History */}
      {refunds.length > 0 && (
        <div className="bg-white border rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Refund History</h3>
          <div className="space-y-3">
            {refunds.map((refund, index) => {
              const isExcessive = refund.amount > originalPayment;
              const cumulativeTotal = refunds.slice(0, index + 1).reduce((sum, r) => sum + r.amount, 0);
              const exceedsCumulative = cumulativeTotal > originalPayment;

              return (
                <div
                  key={refund.id}
                  className={`p-4 rounded-lg border-2 ${
                    isExcessive || exceedsCumulative
                      ? 'bg-red-50 border-red-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Refund #{index + 1}</p>
                      <p className="text-xs text-gray-500">{refund.timestamp}</p>
                    </div>
                    <p className={`font-bold text-lg ${
                      isExcessive || exceedsCumulative ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ${refund.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                    <div>Customer: ${refund.customerBalanceBefore.toFixed(2)} → ${(refund.customerBalanceBefore + refund.amount).toFixed(2)}</div>
                    <div>Merchant: ${refund.merchantBalanceBefore.toFixed(2)} → ${(refund.merchantBalanceBefore - refund.amount).toFixed(2)}</div>
                  </div>
                  {(isExcessive || exceedsCumulative) && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ {isExcessive ? 'Single refund exceeds original payment!' : 'Cumulative refunds exceed original payment!'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 Testing Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Original payment was $100.00</li>
          <li>• Try refunding $150.00 (more than original)</li>
          <li>• Or try multiple refunds that total more than $100</li>
          <li>• Expected: System should reject refunds exceeding original payment</li>
          <li>• Actual: System processes any refund amount without validation</li>
        </ul>
      </div>

      {/* Bug Explanation */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">🐛 Bug Details:</h4>
        <p className="text-sm text-gray-700 mb-2">
          The refund system has no validation to check if the refund amount exceeds the original 
          payment. This allows merchants to refund more than they received.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Fix:</strong> Add validation: <code className="bg-gray-200 px-1 rounded">
          if (refundAmount {'>'}  originalPayment || totalRefunded + refundAmount {'>'} originalPayment)</code>
        </p>
      </div>
    </div>
  );
}

RefundSimulator.propTypes = {
  onBugFound: PropTypes.func
};
