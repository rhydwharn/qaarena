import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

const FintechSimulator = ({ bug, onBugFound, disabled }) => {
  const bugId = bug.bugId;

  // FB001: Incorrect Balance Calculation
  if (bugId === 'FB001') {
    return <IncorrectBalanceScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  // FB002: Transfer Limit Not Enforced
  if (bugId === 'FB002') {
    return <TransferLimitScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  // FB003: Duplicate Transaction on Timeout
  if (bugId === 'FB003') {
    return <DuplicateTransactionScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  // FB004: Negative Balance Allowed
  if (bugId === 'FB004') {
    return <NegativeBalanceScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  // FB005: Currency Conversion Outdated Rate
  if (bugId === 'FB005') {
    return <CurrencyConversionScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  return <div>Simulator not implemented for {bugId}</div>;
};

// FB001: Incorrect Balance Calculation After Multiple Transactions
const IncorrectBalanceScenario = ({ onBugFound, disabled }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const depositAmount = 100;

  const handleDeposit = () => {
    if (disabled) return;

    // BUG: Simulating rounding error - loses $0.03 per transaction
    const actualDeposit = depositAmount - 0.03;
    
    const newBalance = balance + actualDeposit;
    setBalance(parseFloat(newBalance.toFixed(2)));
    
    const newTransaction = {
      type: 'deposit',
      amount: depositAmount,
      timestamp: new Date().toLocaleTimeString(),
      balance: newBalance
    };
    
    setTransactions([...transactions, newTransaction]);

    // After 3 deposits, enable bug identification
    if (transactions.length === 2) {
      setTimeout(() => {
        if (onBugFound) onBugFound();
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          💰 Bank Account Simulator
        </h2>
        <p className="text-gray-600">
          Make 3 deposits of $100 each and observe the balance
        </p>
      </div>

      {/* Account Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Current Balance</p>
            <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <DollarSign className="h-12 w-12 text-blue-200" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-100">Account: ****1234</span>
          <span className="text-blue-100">Savings</span>
        </div>
      </div>

      {/* Deposit Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Make a Deposit</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={depositAmount}
                readOnly
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
              />
            </div>
          </div>
          <button
            onClick={handleDeposit}
            disabled={disabled || transactions.length >= 3}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            Deposit ${depositAmount}
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Deposits made: {transactions.length}/3
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Deposit</p>
                  <p className="text-sm text-gray-500">{tx.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+${tx.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Balance: ${tx.balance.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {transactions.length === 3 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            🤔 You've made 3 deposits of $100 each. Check the final balance carefully...
          </p>
        </div>
      )}
    </div>
  );
};

// FB002: Transfer Limit Not Enforced
const TransferLimitScenario = ({ onBugFound, disabled }) => {
  const [balance] = useState(10000);
  const [transferAmount, setTransferAmount] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const dailyLimit = 5000;

  const handleTransfer = () => {
    if (disabled || transferred) return;

    const amount = parseFloat(transferAmount);
    
    // BUG: Validation happens AFTER transfer, not before
    setTransferred(true);
    
    setTimeout(() => {
      if (amount > dailyLimit) {
        setShowWarning(true);
      }
      if (onBugFound) onBugFound();
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          💸 Transfer Money
        </h2>
        <p className="text-gray-600">
          Daily transfer limit: ${dailyLimit.toLocaleString()}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>Available Balance:</strong> ${balance.toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transfer Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg"
              disabled={disabled || transferred}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Try entering an amount above the daily limit (e.g., $6,000)
          </p>
        </div>

        <button
          onClick={handleTransfer}
          disabled={disabled || !transferAmount || transferred}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {transferred ? 'Transfer Completed' : 'Transfer Now'}
        </button>
      </div>

      {transferred && !showWarning && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✓ Transfer of ${parseFloat(transferAmount).toLocaleString()} completed successfully!
          </p>
        </div>
      )}

      {showWarning && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            ⚠️ Warning: This transfer exceeds your daily limit of ${dailyLimit.toLocaleString()}!
          </p>
          <p className="text-red-600 text-sm mt-2">
            (But the transfer already went through... 🤔)
          </p>
        </div>
      )}
    </div>
  );
};

// FB003: Duplicate Transaction on Network Timeout
const DuplicateTransactionScenario = ({ onBugFound, disabled }) => {
  const [balance, setBalance] = useState(1000);
  const [amount] = useState(100);
  const [status, setStatus] = useState('idle'); // idle, loading, timeout, success
  const [transactions, setTransactions] = useState([]);

  const handleTransfer = () => {
    if (disabled) return;

    setStatus('loading');
    
    // Simulate network timeout
    setTimeout(() => {
      setStatus('timeout');
    }, 2000);
  };

  const handleRetry = () => {
    if (disabled) return;

    setStatus('loading');
    
    // BUG: No idempotency check - processes transaction again
    setTimeout(() => {
      const newBalance = balance - (amount * 2); // Deducted twice!
      setBalance(newBalance);
      setTransactions([
        { id: 1, amount, time: new Date().toLocaleTimeString() },
        { id: 2, amount, time: new Date().toLocaleTimeString() }
      ]);
      setStatus('success');
      if (onBugFound) onBugFound();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔄 Money Transfer
        </h2>
        <p className="text-gray-600">
          Transfer $100 to John Doe
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>Your Balance:</strong> ${balance.toFixed(2)}
        </p>
      </div>

      <div className="space-y-4">
        {status === 'idle' && (
          <button
            onClick={handleTransfer}
            disabled={disabled}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Send ${amount}
          </button>
        )}

        {status === 'loading' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Processing transfer...</p>
          </div>
        )}

        {status === 'timeout' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">⚠️ Network Timeout</p>
              <p className="text-red-600 text-sm mt-1">
                The request timed out. Please try again.
              </p>
            </div>
            <button
              onClick={handleRetry}
              disabled={disabled}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Retry Transfer
            </button>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800">
                ✓ Transfer completed successfully!
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Transaction History:</h3>
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between py-2 border-b last:border-0">
                  <span>Transfer to John Doe</span>
                  <span className="text-red-600">-${tx.amount}</span>
                  <span className="text-sm text-gray-500">{tx.time}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t font-semibold">
                <div className="flex justify-between">
                  <span>New Balance:</span>
                  <span>${balance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                🤔 Check your transaction history and balance carefully...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// FB004: Negative Balance Allowed in Savings Account
const NegativeBalanceScenario = ({ onBugFound, disabled }) => {
  const [balance, setBalance] = useState(50);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawn, setWithdrawn] = useState(false);

  const handleWithdraw = () => {
    if (disabled || withdrawn) return;

    const amount = parseFloat(withdrawAmount);
    
    // BUG: No balance validation - allows negative balance
    const newBalance = balance - amount;
    setBalance(newBalance);
    setWithdrawn(true);
    
    if (onBugFound) onBugFound();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏦 Savings Account Withdrawal
        </h2>
        <p className="text-gray-600">
          Withdraw money from your savings account
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>Account Type:</strong> Savings
        </p>
        <p className="text-blue-800">
          <strong>Available Balance:</strong> ${balance.toFixed(2)}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg"
              disabled={disabled || withdrawn}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Try withdrawing more than your balance (e.g., $75)
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={disabled || !withdrawAmount || withdrawn}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg"
        >
          {withdrawn ? 'Withdrawal Completed' : 'Withdraw'}
        </button>
      </div>

      {withdrawn && (
        <div className="mt-6 space-y-4">
          <div className={`border rounded-lg p-4 ${
            balance < 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <p className={balance < 0 ? 'text-red-800' : 'text-green-800'}>
              ✓ Withdrawal of ${parseFloat(withdrawAmount).toFixed(2)} completed
            </p>
            <p className={`mt-2 font-semibold ${balance < 0 ? 'text-red-900' : 'text-green-900'}`}>
              New Balance: ${balance.toFixed(2)}
            </p>
          </div>

          {balance < 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                🤔 Wait... can a savings account have a negative balance?
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// FB005: Currency Conversion Uses Outdated Rate
const CurrencyConversionScenario = ({ onBugFound, disabled }) => {
  const [amount, setAmount] = useState('1000');
  const [converted, setConverted] = useState(false);
  const [result, setResult] = useState(0);
  
  const currentRate = 1.10;
  const cachedRate = 1.08; // BUG: Using old rate

  const handleConvert = () => {
    if (disabled || converted) return;

    const amt = parseFloat(amount);
    // BUG: Using outdated exchange rate
    const convertedAmount = amt * cachedRate;
    setResult(convertedAmount);
    setConverted(true);
    
    setTimeout(() => {
      if (onBugFound) onBugFound();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          💱 Currency Exchange
        </h2>
        <p className="text-gray-600">
          Convert USD to EUR
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">Exchange Rate (USD → EUR)</p>
            <p className="text-2xl font-bold text-blue-900">{cachedRate}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Last updated: 24 hours ago
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount in USD
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg"
              disabled={disabled || converted}
            />
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={disabled || !amount || converted}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg"
        >
          Convert to EUR
        </button>
      </div>

      {converted && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 mb-2">✓ Conversion Complete</p>
            <p className="text-2xl font-bold text-green-900">
              €{result.toFixed(2)}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              💡 Tip: Check the current market rate online. Is ${amount} × {currentRate} = €{(parseFloat(amount) * currentRate).toFixed(2)}?
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FintechSimulator;
