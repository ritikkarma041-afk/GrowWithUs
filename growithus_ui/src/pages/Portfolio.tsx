import React, { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Percent, IndianRupee } from 'lucide-react';
import StatCard from '../components/StatCard';
import ReactECharts from 'echarts-for-react';
import { faker } from '@faker-js/faker';
import PageHeader from '../components/PageHeader';

const Portfolio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const holdings = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    symbol: faker.helpers.arrayElement(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN', 'BAJFINANCE', 'KOTAKBANK', 'WIPRO', 'ASIANPAINT']),
    name: faker.company.name(),
    shares: faker.number.int({ min: 10, max: 500 }),
    price: faker.number.float({ min: 500, max: 3000, fractionDigits: 2 }),
    change: faker.number.float({ min: -5, max: 8, fractionDigits: 2 }),
    marketValue: 0,
    allocation: 0
  }));

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.shares * holding.price), 0);
  holdings.forEach(holding => {
    holding.marketValue = holding.shares * holding.price;
    holding.allocation = (holding.marketValue / totalValue) * 100;
  });

  const allocationOption = {
    title: { text: 'Asset Allocation', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' } },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: ₹{c} ({d}%)' },
    series: [{ name: 'Portfolio', type: 'pie', radius: '50%', data: holdings.slice(0, 6).map(holding => ({ value: holding.marketValue, name: holding.symbol, itemStyle: { color: faker.helpers.arrayElement(['#059669', '#10b981', '#0891b2', '#0e7490', '#06b6d4', '#22d3ee']) } })), emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }]
  };

  const performanceData = Array.from({ length: 30 }, (_, i) => {
    const baseValue = 10000000;
    const randomWalk = faker.number.float({ min: -200000, max: 300000 });
    return baseValue + (i * 100000) + randomWalk;
  });

  const performanceOption = {
    title: { text: 'Portfolio Performance (30 Days)', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' } },
    tooltip: { trigger: 'axis', formatter: function(params: any) { return `Day ${params[0].dataIndex + 1}: ₹${params[0].value.toLocaleString('en-IN')}`; } },
    xAxis: { type: 'category', data: Array.from({ length: 30 }, (_, i) => `D${i + 1}`) },
    yAxis: { type: 'value', axisLabel: { formatter: '₹{value}' } },
    series: [{ data: performanceData, type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#059669', width: 2 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(5, 150, 105, 0.2)' }, { offset: 1, color: 'rgba(5, 150, 105, 0.05)' }] } } }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const filteredHoldings = holdings.filter(holding =>
    holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    holding.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Portfolio" subtitle="Track your investments and asset allocation." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Value" value={`₹${totalValue.toLocaleString('en-IN')}`} change="+8.3% today" changeType="positive" icon={IndianRupee} />
        <StatCard title="Day's Gain" value={`₹${(1245000).toLocaleString('en-IN')}`} change="+2.1%" changeType="positive" icon={TrendingUp} />
        <StatCard title="Total Gain" value={`₹${(2834000).toLocaleString('en-IN')}`} change="+22.7%" changeType="positive" icon={Percent} />
        <StatCard title="Holdings" value={holdings.length.toString()} changeType="neutral" icon={Filter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={allocationOption} style={{ height: '350px' }} notMerge={true} lazyUpdate={true} />
        </div>
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={performanceOption} style={{ height: '350px' }} notMerge={true} lazyUpdate={true} />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search holdings..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {filteredHoldings.map((holding) => (
                <tr key={holding.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                    <div className="text-sm text-gray-500 md:hidden">{holding.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell"><div className="text-sm text-gray-900">{holding.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holding.shares}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{holding.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${holding.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {holding.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{holding.marketValue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
