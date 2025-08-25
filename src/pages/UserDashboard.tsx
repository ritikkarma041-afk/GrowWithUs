import React, { useState, useMemo } from 'react';
import { TrendingUp, Activity, ArrowDownToLine, ArrowUpFromLine, CheckCircle, IndianRupee, Send } from 'lucide-react';
import StatCard from '../components/StatCard';
import ReactECharts from 'echarts-for-react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';

interface Transaction {
  id: number;
  date: string;
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdrawal';
  asset: string;
  amount: number;
  status: 'Completed' | 'Pending';
}

const UserDashboard: React.FC = () => {
  const [currentValue, setCurrentValue] = useState(15243000);
  const [investedValue, setInvestedValue] = useState(12500000);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: '2025-01-15', type: 'Buy', asset: 'RELIANCE', amount: 250000, status: 'Completed' },
    { id: 2, date: '2025-01-14', type: 'Sell', asset: 'TCS', amount: 180000, status: 'Completed' },
    { id: 3, date: '2025-01-13', type: 'Buy', asset: 'HDFCBANK', amount: 320000, status: 'Completed' },
    { id: 4, date: '2025-01-12', type: 'Buy', asset: 'INFY', amount: 210000, status: 'Pending' },
  ]);

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null);

  const returns = useMemo(() => currentValue - investedValue, [currentValue, investedValue]);
  const returnPercentage = useMemo(() => (investedValue > 0 ? (returns / investedValue) * 100 : 0), [returns, investedValue]);

  const resetAndCloseInvestModal = () => {
    setIsInvestModalOpen(false);
    setTransactionSuccess(null);
    setInvestmentAmount('');
  };

  const resetAndCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setTransactionSuccess(null);
    setWithdrawalAmount('');
  };

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(investmentAmount);
    if (amount > 0) {
      setInvestedValue(prev => prev + amount);
      setCurrentValue(prev => prev + amount);
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        date: new Date().toISOString().split('T')[0],
        type: 'Deposit',
        asset: 'Cash',
        amount: amount,
        status: 'Completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setTransactionSuccess(`₹${amount.toLocaleString('en-IN')} Added to Portfolio`);
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (amount > 0 && amount <= currentValue) {
      setCurrentValue(prev => prev - amount);
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        date: new Date().toISOString().split('T')[0],
        type: 'Withdrawal',
        asset: 'Cash',
        amount: amount,
        status: 'Completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setTransactionSuccess(`Withdrawal of ₹${amount.toLocaleString('en-IN')} is being processed`);
    } else if (amount > currentValue) {
      alert("Withdrawal amount cannot exceed current portfolio value.");
    }
  };

  const chartOption = {
    title: { text: 'Portfolio Performance', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#059669' } } },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    yAxis: { type: 'value', axisLabel: { formatter: '₹{value}L' } },
    series: [{
      data: [85, 92, 78, 95, 102, 88, 115, 125, 118, 135, 142, 150].map(v => v * 10000), // In Lakhs
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#059669', width: 3 },
      itemStyle: { color: '#059669' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(5, 150, 105, 0.3)' }, { offset: 1, color: 'rgba(5, 150, 105, 0.1)' }] } }
    }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const getTransactionTypeStyle = (type: Transaction['type']) => {
    switch (type) {
      case 'Buy': return 'bg-emerald-100 text-emerald-800';
      case 'Sell': return 'bg-red-100 text-red-800';
      case 'Deposit': return 'bg-blue-100 text-blue-800';
      case 'Withdrawal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <PageHeader title="Dashboard" subtitle="Welcome back! Here's your portfolio overview." />
        <div className="flex space-x-2 sm:space-x-4 mt-4 sm:mt-0 w-full sm:w-auto">
          <button
            onClick={() => setIsInvestModalOpen(true)}
            className="w-1/2 sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md text-sm"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Invest</span>
          </button>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="w-1/2 sm:w-auto px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2 shadow-md text-sm"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Current Value" value={`₹${currentValue.toLocaleString('en-IN')}`} icon={IndianRupee} />
        <StatCard title="Invested Value" value={`₹${investedValue.toLocaleString('en-IN')}`} icon={TrendingUp} />
        <StatCard title="Total Returns" value={`₹${returns.toLocaleString('en-IN')}`} change={`${returns >= 0 ? '+' : ''}${returnPercentage.toFixed(2)}%`} changeType={returns >= 0 ? "positive" : "negative"} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={chartOption} style={{ height: '400px' }} notMerge={true} lazyUpdate={true} />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeStyle(transaction.type)}`}>{transaction.type}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.asset}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{transaction.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>{transaction.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isInvestModalOpen} onClose={resetAndCloseInvestModal}>
        {transactionSuccess ? (
          <div className="text-center p-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-6 animate-pulse-glow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Success!</h3>
            <p className="text-gray-600 mt-2 text-lg">{transactionSuccess}</p>
            <div className="mt-8 w-full space-y-3">
              <button onClick={() => { setTransactionSuccess(null); setInvestmentAmount(''); }} className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700">Make Another Deposit</button>
              <button onClick={resetAndCloseInvestModal} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddInvestment} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Add Investment</h2>
            <div>
              <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (INR)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="text-gray-500 text-xl">₹</span></div>
                <input id="investment-amount" type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} required min="1" className="w-full pl-10 pr-4 py-4 text-xl border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="0.00" />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">Confirm Investment</button>
          </form>
        )}
      </Modal>

      <Modal isOpen={isWithdrawModalOpen} onClose={resetAndCloseWithdrawModal}>
        {transactionSuccess ? (
          <div className="text-center p-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-6 animate-pulse-glow">
              <Send className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Withdrawal Initiated</h3>
            <p className="text-gray-600 mt-2 text-lg">{transactionSuccess}</p>
            <div className="mt-8 w-full space-y-3">
              <button onClick={() => { setTransactionSuccess(null); setWithdrawalAmount(''); }} className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700">Make Another Withdrawal</button>
              <button onClick={resetAndCloseWithdrawModal} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Withdraw Funds</h2>
            <div>
              <label htmlFor="withdrawal-amount" className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw (INR)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="text-gray-500 text-xl">₹</span></div>
                <input id="withdrawal-amount" type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} required min="1" max={currentValue} className="w-full pl-10 pr-4 py-4 text-xl border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="0.00" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Maximum withdrawable amount: ₹{currentValue.toLocaleString('en-IN')}</p>
            </div>
            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">Confirm Withdrawal</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserDashboard;
