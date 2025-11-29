import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, CreditCard, DollarSign, Eye, FileText, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ATMSimulator() {
  const [screen, setScreen] = useState('welcome');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(5000.00);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', amount: 1000, date: '2024-11-25', balance: 5000 },
    { id: 2, type: 'Withdrawal', amount: 500, date: '2024-11-24', balance: 4000 },
    { id: 3, type: 'Deposit', amount: 2000, date: '2024-11-23', balance: 4500 }
  ]);
  const [error, setError] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const correctPin = '1234';

  const handlePinSubmit = () => {
    if (pin === correctPin) {
      setScreen('menu');
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handleWithdrawal = () => {
    const withdrawAmount = parseFloat(amount);
    if (!amount || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (withdrawAmount > balance) {
      setError('Insufficient funds');
      return;
    }
    if (withdrawAmount % 10 !== 0) {
      setError('Amount must be in multiples of $10');
      return;
    }

    const newBalance = balance - withdrawAmount;
    setBalance(newBalance);
    setTransactions([
      { id: transactions.length + 1, type: 'Withdrawal', amount: withdrawAmount, date: new Date().toISOString().split('T')[0], balance: newBalance },
      ...transactions
    ]);
    setAmount('');
    setScreen('success');
    setError('');
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!amount || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const newBalance = balance + depositAmount;
    setBalance(newBalance);
    setTransactions([
      { id: transactions.length + 1, type: 'Deposit', amount: depositAmount, date: new Date().toISOString().split('T')[0], balance: newBalance },
      ...transactions
    ]);
    setAmount('');
    setScreen('success');
    setError('');
  };

  const handlePinChange = () => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setError('PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    setScreen('success');
    setNewPin('');
    setConfirmPin('');
    setError('');
  };

  const resetToMenu = () => {
    setScreen('menu');
    setAmount('');
    setError('');
    setNewPin('');
    setConfirmPin('');
  };

  const logout = () => {
    setScreen('welcome');
    setPin('');
    setAmount('');
    setError('');
  };

  const handleKeypadClick = (key) => {
    if (key === 'Cancel') {
      // Clear the current input based on screen
      if (screen === 'welcome') setPin('');
      else if (screen === 'withdrawal' || screen === 'deposit') setAmount('');
      else if (screen === 'change-pin') {
        setNewPin('');
        setConfirmPin('');
      }
      setError('');
    } else if (key === 'Enter') {
      // Submit based on current screen
      if (screen === 'welcome') handlePinSubmit();
      else if (screen === 'withdrawal') handleWithdrawal();
      else if (screen === 'deposit') handleDeposit();
      else if (screen === 'change-pin') handlePinChange();
    } else {
      // Add number to current input
      if (screen === 'welcome' && pin.length < 4) {
        setPin(pin + key);
      } else if (screen === 'withdrawal' || screen === 'deposit') {
        setAmount(amount + key);
      } else if (screen === 'change-pin') {
        if (newPin.length < 4) {
          setNewPin(newPin + key);
        } else if (confirmPin.length < 4) {
          setConfirmPin(confirmPin + key);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-6" data-cy="atm-simulator-page">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/arena/dashboard" data-cy="atm-back-button">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-white text-right">
            <h1 className="text-2xl font-bold" data-cy="atm-title">SecureBank ATM</h1>
            <p className="text-sm opacity-80" data-cy="atm-subtitle">Practice ATM testing scenarios</p>
          </div>
        </div>

        {/* ATM Machine */}
        <Card className="bg-gray-800 border-4 border-gray-700 shadow-2xl" data-cy="atm-machine">
          <CardContent className="p-8">
            {/* Screen */}
            <div className="bg-blue-50 rounded-lg p-8 mb-6 min-h-[400px]" data-cy="atm-screen">
              
              {/* Welcome Screen */}
              {screen === 'welcome' && (
                <div className="text-center" data-cy="atm-welcome-screen">
                  <CreditCard className="h-20 w-20 text-blue-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4" data-cy="atm-welcome-title">
                    Welcome to SecureBank
                  </h2>
                  <p className="text-gray-600 mb-8" data-cy="atm-welcome-message">
                    Please enter your 4-digit PIN to continue
                  </p>
                  
                  <div className="max-w-xs mx-auto">
                    <div className="relative mb-4">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        maxLength="4"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter PIN"
                        className="pl-10 text-center text-2xl tracking-widest"
                        data-cy="atm-pin-input"
                      />
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 flex items-center gap-2" data-cy="atm-pin-error">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}
                    <Button 
                      onClick={handlePinSubmit} 
                      className="w-full"
                      disabled={pin.length !== 4}
                      data-cy="atm-pin-submit"
                    >
                      Enter
                    </Button>
                    <p className="text-xs text-gray-500 mt-4" data-cy="atm-demo-hint">
                      Demo PIN: 1234
                    </p>
                  </div>
                </div>
              )}

              {/* Main Menu */}
              {screen === 'menu' && (
                <div data-cy="atm-menu-screen">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-cy="atm-menu-title">
                    Select Transaction
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setScreen('balance')} 
                      className="h-24 text-lg"
                      data-cy="atm-menu-balance"
                    >
                      <Eye className="h-6 w-6 mr-2" />
                      Check Balance
                    </Button>
                    <Button 
                      onClick={() => setScreen('withdrawal')} 
                      className="h-24 text-lg"
                      data-cy="atm-menu-withdrawal"
                    >
                      <DollarSign className="h-6 w-6 mr-2" />
                      Withdraw Cash
                    </Button>
                    <Button 
                      onClick={() => setScreen('deposit')} 
                      className="h-24 text-lg"
                      data-cy="atm-menu-deposit"
                    >
                      <DollarSign className="h-6 w-6 mr-2" />
                      Deposit Cash
                    </Button>
                    <Button 
                      onClick={() => setScreen('statement')} 
                      className="h-24 text-lg"
                      data-cy="atm-menu-statement"
                    >
                      <FileText className="h-6 w-6 mr-2" />
                      Mini Statement
                    </Button>
                    <Button 
                      onClick={() => setScreen('changePin')} 
                      className="h-24 text-lg"
                      variant="outline"
                      data-cy="atm-menu-change-pin"
                    >
                      <Lock className="h-6 w-6 mr-2" />
                      Change PIN
                    </Button>
                    <Button 
                      onClick={logout} 
                      className="h-24 text-lg"
                      variant="destructive"
                      data-cy="atm-menu-exit"
                    >
                      Exit
                    </Button>
                  </div>
                </div>
              )}

              {/* Balance Screen */}
              {screen === 'balance' && (
                <div className="text-center" data-cy="atm-balance-screen">
                  <Eye className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4" data-cy="atm-balance-title">
                    Account Balance
                  </h2>
                  <div className="bg-white rounded-lg p-6 mb-6 max-w-sm mx-auto">
                    <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                    <p className="text-4xl font-bold text-green-600" data-cy="atm-balance-amount">
                      ${balance.toFixed(2)}
                    </p>
                  </div>
                  <Button onClick={resetToMenu} data-cy="atm-balance-back">
                    Back to Menu
                  </Button>
                </div>
              )}

              {/* Withdrawal Screen */}
              {screen === 'withdrawal' && (
                <div data-cy="atm-withdrawal-screen">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-cy="atm-withdrawal-title">
                    Cash Withdrawal
                  </h2>
                  <div className="max-w-sm mx-auto">
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">Available Balance</p>
                      <p className="text-2xl font-bold text-gray-900" data-cy="atm-withdrawal-balance">
                        ${balance.toFixed(2)}
                      </p>
                    </div>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="mb-4 text-lg"
                      data-cy="atm-withdrawal-input"
                    />
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm" data-cy="atm-withdrawal-error">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[20, 50, 100, 200, 500, 1000].map(amt => (
                        <Button
                          key={amt}
                          variant="outline"
                          onClick={() => setAmount(amt.toString())}
                          data-cy={`atm-quick-amount-${amt}`}
                        >
                          ${amt}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleWithdrawal} className="flex-1" data-cy="atm-withdrawal-submit">
                        Withdraw
                      </Button>
                      <Button onClick={resetToMenu} variant="outline" data-cy="atm-withdrawal-cancel">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Deposit Screen */}
              {screen === 'deposit' && (
                <div data-cy="atm-deposit-screen">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-cy="atm-deposit-title">
                    Cash Deposit
                  </h2>
                  <div className="max-w-sm mx-auto">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter deposit amount"
                      className="mb-4 text-lg"
                      data-cy="atm-deposit-input"
                    />
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm" data-cy="atm-deposit-error">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleDeposit} className="flex-1" data-cy="atm-deposit-submit">
                        Deposit
                      </Button>
                      <Button onClick={resetToMenu} variant="outline" data-cy="atm-deposit-cancel">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mini Statement */}
              {screen === 'statement' && (
                <div data-cy="atm-statement-screen">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-cy="atm-statement-title">
                    Mini Statement
                  </h2>
                  <div className="space-y-2 mb-6" data-cy="atm-statement-list">
                    {transactions.slice(0, 5).map(txn => (
                      <div 
                        key={txn.id} 
                        className="bg-white rounded p-4 flex items-center justify-between"
                        data-cy={`atm-transaction-${txn.id}`}
                      >
                        <div>
                          <p className="font-semibold" data-cy={`atm-transaction-type-${txn.id}`}>
                            {txn.type}
                          </p>
                          <p className="text-sm text-gray-600" data-cy={`atm-transaction-date-${txn.id}`}>
                            {txn.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${txn.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`} data-cy={`atm-transaction-amount-${txn.id}`}>
                            {txn.type === 'Deposit' ? '+' : '-'}${txn.amount}
                          </p>
                          <p className="text-sm text-gray-600" data-cy={`atm-transaction-balance-${txn.id}`}>
                            Bal: ${txn.balance}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={resetToMenu} className="w-full" data-cy="atm-statement-back">
                    Back to Menu
                  </Button>
                </div>
              )}

              {/* Change PIN */}
              {screen === 'changePin' && (
                <div data-cy="atm-change-pin-screen">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-cy="atm-change-pin-title">
                    Change PIN
                  </h2>
                  <div className="max-w-sm mx-auto">
                    <Input
                      type="password"
                      maxLength="4"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Enter new PIN"
                      className="mb-4"
                      data-cy="atm-new-pin-input"
                    />
                    <Input
                      type="password"
                      maxLength="4"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Confirm new PIN"
                      className="mb-4"
                      data-cy="atm-confirm-pin-input"
                    />
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm" data-cy="atm-change-pin-error">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handlePinChange} className="flex-1" data-cy="atm-change-pin-submit">
                        Change PIN
                      </Button>
                      <Button onClick={resetToMenu} variant="outline" data-cy="atm-change-pin-cancel">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Screen */}
              {screen === 'success' && (
                <div className="text-center" data-cy="atm-success-screen">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-green-600 mb-4" data-cy="atm-success-title">
                    Transaction Successful!
                  </h2>
                  <p className="text-gray-600 mb-8" data-cy="atm-success-message">
                    Your transaction has been completed successfully
                  </p>
                  <Button onClick={resetToMenu} data-cy="atm-success-back">
                    Back to Menu
                  </Button>
                </div>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2" data-cy="atm-keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Cancel', 0, 'Enter'].map((key, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-12 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  onClick={() => handleKeypadClick(key)}
                  data-cy={`atm-key-${key}`}
                >
                  {key}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
