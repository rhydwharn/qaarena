import { useState } from 'react';
import PropTypes from 'prop-types';
import { Banknote, AlertCircle, TrendingDown } from 'lucide-react';

/**
 * FB013: Withdrawal Processes Twice on Slow Network
 * Bug: Double-click creates duplicate transactions
 */
export default function WithdrawalSimulator({ onBugFound }) {
  const [balance, setBalance] = useState(1000);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [bugDetected, setBugDetected] = useState(false);

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    // BUG: No button disable or request deduplication
    // User can click multiple times before first request completes
    setProcessing(true);

    // Simulate network delay
    setTimeout(() => {
      const newTransaction = {
        id: Date.now() + Math.random(),
        amount: withdrawAmount,
        timestamp: new Date().toLocaleTimeString(),
        balance: balance - withdrawAmount
      };

      setTransactions(prev => [...prev, newTransaction]);
      setBalance(prev => prev - withdrawAmount);
      setProcessing(false);
      setAmount('');

      // Check for duplicate transactions (same amount within 2 seconds)
      const recentTransactions = transactions.filter(
        tx => Date.now() - tx.id < 2000
      );
      const duplicates = recentTransactions.filter(
        tx => Math.abs(tx.amount - withdrawAmount) < 0.01
      );

      if (duplicates.length > 0) {
        setBugDetected(true);
        onBugFound?.();
      }
    }, 2000); // 2 second delay to simulate slow network
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">ATM Withdrawal</h2>
            <p className="text-indigo-100">Withdraw cash from your account</p>
          </div>
          <Banknote className="h-12 w-12 opacity-80" />
        </div>
      </div>

      {/* Balance Display */}
      <div className="bg-white border-2 border-indigo-500 rounded-lg p-6 shadow">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Available Balance</p>
          <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-600' : 'text-indigo-600'}`}>
            ${balance.toFixed(2)}
          </p>
          {balance < 0 && (
            <p className="text-red-600 text-sm mt-2">⚠️ Negative balance detected!</p>
          )}
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Withdraw Cash</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={processing}
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[100, 200, 500, 1000].map(quickAmount => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                disabled={processing}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg text-sm font-semibold transition-colors"
              >
                ${quickAmount}
              </button>
            ))}
          </div>

          {/* BUG: Button not disabled during processing! */}
          <button
            onClick={handleWithdraw}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              processing
                ? 'bg-yellow-500 text-white cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {processing ? 'Processing... (Try clicking again!)' : 'Withdraw Cash'}
          </button>

          {processing && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Network is slow... Button should be disabled but isn&apos;t!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-white border rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <div className="space-y-2">
            {transactions.map((tx, index) => {
              // Check if this is a duplicate
              const isDuplicate = transactions.filter(
                t => Math.abs(t.amount - tx.amount) < 0.01 && 
                     Math.abs(t.id - tx.id) < 2000
              ).length > 1;

              return (
                <div
                  key={tx.id}
                  className={`p-3 rounded-lg border ${
                    isDuplicate ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <TrendingDown className={`h-5 w-5 ${isDuplicate ? 'text-red-600' : 'text-gray-600'}`} />
                      <div>
                        <p className="font-semibold">Withdrawal #{index + 1}</p>
                        <p className="text-xs text-gray-500">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isDuplicate ? 'text-red-600' : 'text-gray-900'}`}>
                        -${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: ${tx.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {isDuplicate && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Duplicate transaction detected!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bug Detection Alert */}
      {bugDetected && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">🐛 Bug Detected!</p>
              <p className="text-sm text-red-700 mt-1">
                Duplicate transactions created! The withdrawal button should be disabled during 
                processing to prevent double-clicks from creating multiple transactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 Testing Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter withdrawal amount (e.g., $500)</li>
          <li>• Click &quot;Withdraw Cash&quot; button</li>
          <li>• Quickly click the button again while it&apos;s processing</li>
          <li>• Expected: Button should be disabled, only one transaction</li>
          <li>• Actual: Button stays enabled, creates duplicate transactions</li>
        </ul>
      </div>

      {/* Bug Explanation */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">🐛 Bug Details:</h4>
        <p className="text-sm text-gray-700 mb-2">
          This is a race condition bug. The button should be disabled during processing, 
          but it remains clickable. Each click creates a new transaction.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Fix:</strong> Disable the button when processing starts, use idempotency 
          keys, or implement request deduplication on the server.
        </p>
      </div>
    </div>
  );
}

WithdrawalSimulator.propTypes = {
  onBugFound: PropTypes.func
};
