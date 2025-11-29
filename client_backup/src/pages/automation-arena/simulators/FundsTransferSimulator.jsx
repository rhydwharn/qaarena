import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, ArrowLeftRight, User, Plus, Trash2, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function FundsTransferSimulator() {
  const [activeView, setActiveView] = useState('dashboard');
  const [balance, setBalance] = useState(10000.00);
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'John Doe', accountNumber: '1234567890', bank: 'SecureBank' },
    { id: 2, name: 'Jane Smith', accountNumber: '0987654321', bank: 'TrustBank' },
    { id: 3, name: 'Bob Johnson', accountNumber: '5555555555', bank: 'MoneyBank' }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 1, recipient: 'John Doe', amount: 500, date: '2024-11-28', status: 'Completed', reference: 'TXN001' },
    { id: 2, recipient: 'Jane Smith', amount: 1000, date: '2024-11-27', status: 'Completed', reference: 'TXN002' },
    { id: 3, recipient: 'Bob Johnson', amount: 250, date: '2024-11-26', status: 'Pending', reference: 'TXN003' }
  ]);
  
  const [transferForm, setTransferForm] = useState({
    beneficiary: '',
    amount: '',
    description: '',
    otp: ''
  });

  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: '',
    accountNumber: '',
    bank: ''
  });

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBeneficiaryChange = (e) => {
    const { name, value } = e.target;
    setBeneficiaryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setShowOtpScreen(true);
  };

  const handleOtpVerify = () => {
    if (transferForm.otp === '123456') {
      const amount = parseFloat(transferForm.amount);
      const newBalance = balance - amount;
      setBalance(newBalance);
      
      const ref = `TXN${String(transactions.length + 1).padStart(3, '0')}`;
      setTransactionRef(ref);
      
      const newTransaction = {
        id: transactions.length + 1,
        recipient: beneficiaries.find(b => b.id === parseInt(transferForm.beneficiary))?.name || 'Unknown',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        reference: ref
      };
      
      setTransactions([newTransaction, ...transactions]);
      setShowOtpScreen(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setActiveView('dashboard');
        setTransferForm({ beneficiary: '', amount: '', description: '', otp: '' });
      }, 3000);
    }
  };

  const handleAddBeneficiary = (e) => {
    e.preventDefault();
    const newBeneficiary = {
      id: beneficiaries.length + 1,
      ...beneficiaryForm
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setBeneficiaryForm({ name: '', accountNumber: '', bank: '' });
    setActiveView('beneficiaries');
  };

  const handleDeleteBeneficiary = (id) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50" data-cy="transfer-simulator-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" data-cy="transfer-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/arena/dashboard" data-cy="transfer-back-button">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" data-cy="transfer-title">
                  QuickPay - Funds Transfer
                </h1>
                <p className="text-sm text-gray-500" data-cy="transfer-subtitle">
                  Practice testing money transfers and beneficiary management
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4" data-cy="transfer-nav-tabs">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              data-cy="transfer-nav-dashboard"
            >
              Dashboard
            </Button>
            <Button
              variant={activeView === 'transfer' ? 'default' : 'outline'}
              onClick={() => setActiveView('transfer')}
              data-cy="transfer-nav-transfer"
            >
              Send Money
            </Button>
            <Button
              variant={activeView === 'beneficiaries' ? 'default' : 'outline'}
              onClick={() => setActiveView('beneficiaries')}
              data-cy="transfer-nav-beneficiaries"
            >
              Beneficiaries
            </Button>
            <Button
              variant={activeView === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveView('history')}
              data-cy="transfer-nav-history"
            >
              Transaction History
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div data-cy="transfer-dashboard-view">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Balance Card */}
              <Card className="md:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white" data-cy="transfer-balance-card">
                <CardHeader>
                  <CardTitle className="text-white" data-cy="transfer-balance-title">Available Balance</CardTitle>
                  <CardDescription className="text-blue-100" data-cy="transfer-balance-subtitle">
                    Your current account balance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold mb-4" data-cy="transfer-balance-amount">
                    ${balance.toFixed(2)}
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => setActiveView('transfer')}
                    data-cy="transfer-quick-send"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Send Money
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card data-cy="transfer-stats-card">
                <CardHeader>
                  <CardTitle data-cy="transfer-stats-title">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div data-cy="transfer-stat-beneficiaries">
                    <p className="text-sm text-gray-600">Saved Beneficiaries</p>
                    <p className="text-2xl font-bold">{beneficiaries.length}</p>
                  </div>
                  <div data-cy="transfer-stat-transactions">
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card data-cy="transfer-recent-transactions">
              <CardHeader>
                <CardTitle data-cy="transfer-recent-title">Recent Transactions</CardTitle>
                <CardDescription data-cy="transfer-recent-subtitle">
                  Your latest money transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 3).map(txn => (
                    <div 
                      key={txn.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      data-cy={`transfer-recent-txn-${txn.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <ArrowLeftRight className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold" data-cy={`transfer-recent-recipient-${txn.id}`}>
                            {txn.recipient}
                          </p>
                          <p className="text-sm text-gray-600" data-cy={`transfer-recent-date-${txn.id}`}>
                            {txn.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600" data-cy={`transfer-recent-amount-${txn.id}`}>
                          -${txn.amount}
                        </p>
                        <span 
                          className={`text-xs px-2 py-1 rounded ${txn.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                          data-cy={`transfer-recent-status-${txn.id}`}
                        >
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transfer Form View */}
        {activeView === 'transfer' && !showOtpScreen && !showSuccess && (
          <div data-cy="transfer-form-view">
            <Card className="max-w-2xl mx-auto" data-cy="transfer-form-card">
              <CardHeader>
                <CardTitle data-cy="transfer-form-title">Send Money</CardTitle>
                <CardDescription data-cy="transfer-form-subtitle">
                  Transfer funds to your beneficiaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransferSubmit} data-cy="transfer-form">
                  <div className="space-y-4">
                    {/* Select Beneficiary */}
                    <div data-cy="transfer-beneficiary-field">
                      <Label htmlFor="beneficiary" data-cy="transfer-beneficiary-label">
                        Select Beneficiary
                      </Label>
                      <select
                        id="beneficiary"
                        name="beneficiary"
                        value={transferForm.beneficiary}
                        onChange={handleTransferChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        data-cy="transfer-beneficiary-select"
                      >
                        <option value="">Choose a beneficiary</option>
                        {beneficiaries.map(ben => (
                          <option key={ben.id} value={ben.id} data-cy={`transfer-beneficiary-option-${ben.id}`}>
                            {ben.name} - {ben.accountNumber}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div data-cy="transfer-amount-field">
                      <Label htmlFor="amount" data-cy="transfer-amount-label">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          value={transferForm.amount}
                          onChange={handleTransferChange}
                          placeholder="0.00"
                          className="pl-10"
                          required
                          data-cy="transfer-amount-input"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1" data-cy="transfer-available-balance">
                        Available: ${balance.toFixed(2)}
                      </p>
                    </div>

                    {/* Description */}
                    <div data-cy="transfer-description-field">
                      <Label htmlFor="description" data-cy="transfer-description-label">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={transferForm.description}
                        onChange={handleTransferChange}
                        placeholder="Payment for..."
                        data-cy="transfer-description-input"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1" data-cy="transfer-form-submit">
                        Continue
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveView('dashboard')}
                        data-cy="transfer-form-cancel"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* OTP Verification Screen */}
        {showOtpScreen && (
          <div data-cy="transfer-otp-view">
            <Card className="max-w-md mx-auto" data-cy="transfer-otp-card">
              <CardHeader>
                <CardTitle className="text-center" data-cy="transfer-otp-title">Verify Transaction</CardTitle>
                <CardDescription className="text-center" data-cy="transfer-otp-subtitle">
                  Enter the OTP sent to your registered mobile number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg" data-cy="transfer-otp-summary">
                    <p className="text-sm text-gray-600">Transfer Amount</p>
                    <p className="text-2xl font-bold text-gray-900" data-cy="transfer-otp-amount">
                      ${transferForm.amount}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">To</p>
                    <p className="font-semibold" data-cy="transfer-otp-recipient">
                      {beneficiaries.find(b => b.id === parseInt(transferForm.beneficiary))?.name}
                    </p>
                  </div>

                  <div data-cy="transfer-otp-field">
                    <Label htmlFor="otp" data-cy="transfer-otp-label">Enter OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength="6"
                      value={transferForm.otp}
                      onChange={handleTransferChange}
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest"
                      data-cy="transfer-otp-input"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center" data-cy="transfer-otp-hint">
                      Demo OTP: 123456
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleOtpVerify} 
                      className="flex-1"
                      disabled={transferForm.otp.length !== 6}
                      data-cy="transfer-otp-verify"
                    >
                      Verify & Transfer
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowOtpScreen(false)}
                      data-cy="transfer-otp-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Screen */}
        {showSuccess && (
          <div data-cy="transfer-success-view">
            <Card className="max-w-md mx-auto" data-cy="transfer-success-card">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-green-600 mb-4" data-cy="transfer-success-title">
                  Transfer Successful!
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg mb-6" data-cy="transfer-success-details">
                  <p className="text-sm text-gray-600 mb-2">Transaction Reference</p>
                  <p className="text-2xl font-bold text-gray-900 mb-4" data-cy="transfer-success-reference">
                    {transactionRef}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Amount Transferred</p>
                  <p className="text-xl font-bold text-gray-900" data-cy="transfer-success-amount">
                    ${transferForm.amount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Beneficiaries View */}
        {activeView === 'beneficiaries' && (
          <div data-cy="transfer-beneficiaries-view">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" data-cy="transfer-beneficiaries-title">Saved Beneficiaries</h2>
              <Button onClick={() => setActiveView('addBeneficiary')} data-cy="transfer-add-beneficiary-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Beneficiary
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4" data-cy="transfer-beneficiaries-grid">
              {beneficiaries.map(ben => (
                <Card key={ben.id} data-cy={`transfer-beneficiary-card-${ben.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg" data-cy={`transfer-beneficiary-name-${ben.id}`}>
                            {ben.name}
                          </h3>
                          <p className="text-sm text-gray-600" data-cy={`transfer-beneficiary-account-${ben.id}`}>
                            {ben.accountNumber}
                          </p>
                          <p className="text-sm text-gray-600" data-cy={`transfer-beneficiary-bank-${ben.id}`}>
                            {ben.bank}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteBeneficiary(ben.id)}
                        data-cy={`transfer-beneficiary-delete-${ben.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add Beneficiary Form */}
        {activeView === 'addBeneficiary' && (
          <div data-cy="transfer-add-beneficiary-view">
            <Card className="max-w-2xl mx-auto" data-cy="transfer-add-beneficiary-card">
              <CardHeader>
                <CardTitle data-cy="transfer-add-beneficiary-title">Add New Beneficiary</CardTitle>
                <CardDescription data-cy="transfer-add-beneficiary-subtitle">
                  Save beneficiary details for quick transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBeneficiary} data-cy="transfer-add-beneficiary-form">
                  <div className="space-y-4">
                    <div data-cy="transfer-ben-name-field">
                      <Label htmlFor="name" data-cy="transfer-ben-name-label">Beneficiary Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={beneficiaryForm.name}
                        onChange={handleBeneficiaryChange}
                        placeholder="John Doe"
                        required
                        data-cy="transfer-ben-name-input"
                      />
                    </div>

                    <div data-cy="transfer-ben-account-field">
                      <Label htmlFor="accountNumber" data-cy="transfer-ben-account-label">
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={beneficiaryForm.accountNumber}
                        onChange={handleBeneficiaryChange}
                        placeholder="1234567890"
                        required
                        data-cy="transfer-ben-account-input"
                      />
                    </div>

                    <div data-cy="transfer-ben-bank-field">
                      <Label htmlFor="bank" data-cy="transfer-ben-bank-label">Bank Name</Label>
                      <Input
                        id="bank"
                        name="bank"
                        value={beneficiaryForm.bank}
                        onChange={handleBeneficiaryChange}
                        placeholder="SecureBank"
                        required
                        data-cy="transfer-ben-bank-input"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1" data-cy="transfer-ben-submit">
                        Add Beneficiary
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveView('beneficiaries')}
                        data-cy="transfer-ben-cancel"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transaction History */}
        {activeView === 'history' && (
          <div data-cy="transfer-history-view">
            <h2 className="text-2xl font-bold mb-6" data-cy="transfer-history-title">Transaction History</h2>
            
            <div className="space-y-4" data-cy="transfer-history-list">
              {transactions.map(txn => (
                <Card key={txn.id} data-cy={`transfer-history-txn-${txn.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${txn.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          {txn.status === 'Completed' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold" data-cy={`transfer-history-recipient-${txn.id}`}>
                            {txn.recipient}
                          </p>
                          <p className="text-sm text-gray-600" data-cy={`transfer-history-date-${txn.id}`}>
                            {txn.date}
                          </p>
                          <p className="text-xs text-gray-500" data-cy={`transfer-history-reference-${txn.id}`}>
                            Ref: {txn.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600" data-cy={`transfer-history-amount-${txn.id}`}>
                          -${txn.amount}
                        </p>
                        <span 
                          className={`text-xs px-2 py-1 rounded ${txn.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                          data-cy={`transfer-history-status-${txn.id}`}
                        >
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
