import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUpDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { faker } from '@faker-js/faker';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const transactions = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    date: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
    type: faker.helpers.arrayElement(['Buy', 'Sell', 'Dividend', 'Transfer']),
    symbol: faker.helpers.arrayElement(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC']),
    description: faker.lorem.words(3),
    quantity: faker.number.int({ min: 1, max: 100 }),
    price: faker.number.float({ min: 500, max: 3000, fractionDigits: 2 }),
    amount: 0,
    status: faker.helpers.arrayElement(['Completed', 'Pending', 'Failed']),
    fee: faker.number.float({ min: 0, max: 150, fractionDigits: 2 })
  }));

  transactions.forEach(transaction => { transaction.amount = transaction.quantity * transaction.price; });

  const filteredTransactions = transactions
    .filter(transaction => (transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) && (filterType === 'all' || transaction.type.toLowerCase() === filterType))
    .sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount': return b.amount - a.amount;
        case 'symbol': return a.symbol.localeCompare(b.symbol);
        default: return 0;
      }
    });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Buy': return 'bg-emerald-100 text-emerald-800';
      case 'Sell': return 'bg-red-100 text-red-800';
      case 'Dividend': return 'bg-blue-100 text-blue-800';
      case 'Transfer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <PageHeader title="Transactions" subtitle="View and manage your trading history." />
      
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="dividend">Dividend</option>
              <option value="transfer">Transfer</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="symbol">Sort by Symbol</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.symbol}</div>
                    <div className="text-sm text-gray-500">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>{transaction.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{transaction.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (<div className="text-center py-12"><p className="text-gray-500">No transactions found.</p></div>)}
      </div>
    </div>
  );
};

export default Transactions;
