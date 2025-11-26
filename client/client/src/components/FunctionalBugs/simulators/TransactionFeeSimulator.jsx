import { useState } from 'react';
import PropTypes from 'prop-types';
import { DollarSign, ArrowRight, AlertCircle } from 'lucide-react';

/**
 * FB007: Transaction Fee Calculated on Gross Instead of Net Amount
 * Bug: Fee calculation references original balance instead of transaction amount
 */
export default function TransactionFeeSimulator({ onBugFound }) {
  const [balance, setBalance] = useState(2000);
  const [transactions, setTransactions] = useState([]);
  const [transferAmount, setTransferAmount] = useState('');
  const [bugDetected, setBugDetected] = useState(false);

  const FEE_PERCENTAGE = 2;
  const INITIAL_BALANCE = 2000;

  const calculateFee = (amount) => {
    // BUG: Uses original balance instead of transaction amount
    // Should be: amount * (FEE_PERCENTAGE / 100)
    // But incorrectly uses: INITIAL_BALANCE * (FEE_PERCENTAGE / 100)
    if (transactions.length > 0) {
      return INITIAL_BALANCE * (FEE_PERCENTAGE / 100); // Wrong!
    }
    return amount * (FEE_PERCENTAGE / 100); // Correct for first transaction
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }

    const fee = calculateFee(amount);
    const total = amount + fee;

    if (total > balance) {
      alert('Insufficient balance including fees');
      return;
    }

    const newBalance = balance - total;
    const newTransaction = {
      id: transactions.length + 1,
      amount,
      fee,
      total,
      timestamp: new Date().toLocaleTimeString()
    };

    setTransactions([...transactions, newTransaction]);
    setBalance(newBalance);
    setTransferAmount('');

    // Detect bug on second transaction
    if (transactions.length === 1 && fee !== amount * (FEE_PERCENTAGE / 100)) {
      setBugDetected(true);
      onBugFound?.();
    }
  };

  const expectedFee = (amount) => amount * (FEE_PERCENTAGE / 100);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Money Transfer</h2>
            <p className="text-green-100">Transfer money with {FEE_PERCENTAGE}% transaction fee</p>
          </div>
          <DollarSign className="h-12 w-12 opacity-80" />
        </div>
      </div>

      {/* Balance Display */}
      <div className="bg-white border-2 border-green-500 rounded-lg p-6 shadow">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Current Balance</p>
          <p className="text-4xl font-bold text-green-600">${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">New Transfer</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {transferAmount && parseFloat(transferAmount) > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transfer Amount:</span>
                <span className="font-semibold">${parseFloat(transferAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction Fee ({FEE_PERCENTAGE}%):</span>
                <span className="font-semibold text-orange-600">
                  ${calculateFee(parseFloat(transferAmount)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="font-semibold">Total Deduction:</span>
                <span className="font-bold text-lg">
                  ${(parseFloat(transferAmount) + calculateFee(parseFloat(transferAmount))).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleTransfer}
            disabled={!transferAmount || parseFloat(transferAmount) <= 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <span>Transfer Money</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-white border rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <div className="space-y-3">
            {transactions.map((tx) => {
              const correctFee = expectedFee(tx.amount);
              const isWrongFee = Math.abs(tx.fee - correctFee) > 0.01;
              
              return (
                <div key={tx.id} className={`p-4 rounded-lg border-2 ${
                  isWrongFee ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Transfer #{tx.id}</p>
                      <p className="text-xs text-gray-500">{tx.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">-${tx.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-semibold">${tx.amount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fee:</span>
                      <span className={`ml-2 font-semibold ${isWrongFee ? 'text-red-600' : ''}`}>
                        ${tx.fee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {isWrongFee && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs text-red-700">
                        ⚠️ Expected fee: ${correctFee.toFixed(2)} ({FEE_PERCENTAGE}% of ${tx.amount.toFixed(2)})
                      </p>
                      <p className="text-xs text-red-700">
                        Actual fee: ${tx.fee.toFixed(2)} (calculated incorrectly!)
                      </p>
                    </div>
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
                The second transaction fee is calculated incorrectly. It uses the original balance 
                (${INITIAL_BALANCE}) instead of the transaction amount to calculate the fee.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 Testing Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Make a first transfer of $1000 (fee should be $20)</li>
          <li>• Make a second transfer of $500 (fee should be $10)</li>
          <li>• Expected: Each fee is {FEE_PERCENTAGE}% of the transfer amount</li>
          <li>• Actual: Second fee is calculated on original balance ($2000), charging $40 instead of $10</li>
        </ul>
      </div>
    </div>
  );
}

TransactionFeeSimulator.propTypes = {
  onBugFound: PropTypes.func
};
