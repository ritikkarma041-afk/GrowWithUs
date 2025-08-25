import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Edit2, Trash2, MoreHorizontal, Mail, UserPlus, IndianRupee, Send } from 'lucide-react';
import StatCard from '../components/StatCard';
import ReactECharts from 'echarts-for-react';
import { faker } from '@faker-js/faker';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';

const AdminDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [lastInvitedEmail, setLastInvitedEmail] = useState('');

  const users = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']),
    joinDate: faker.date.recent({ days: 365 }).toLocaleDateString(),
    investment: `₹${faker.number.int({ min: 100000, max: 5000000 }).toLocaleString('en-IN')}`
  }));

  const userGrowthOption = {
    title: { text: 'User Growth', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 190, 300, 500, 700, 850], type: 'bar', itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#059669' }, { offset: 1, color: '#10b981' }] } } }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const investmentOption = {
    title: { text: 'Total Investments', textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' } },
    tooltip: { trigger: 'axis', formatter: '{b}: ₹{c} Cr' },
    xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
    yAxis: { type: 'value', axisLabel: { formatter: '₹{value} Cr' } },
    series: [{ data: [12.5, 18.2, 25.8, 32.1], type: 'line', smooth: true, lineStyle: { color: '#0891b2', width: 3 }, itemStyle: { color: '#0891b2' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(8, 145, 178, 0.3)' }, { offset: 1, color: 'rgba(8, 145, 178, 0.1)' }] } } }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const resetAndCloseModal = () => {
    setIsModalOpen(false);
    setInviteSent(false);
    setInviteEmail('');
    setLastInvitedEmail('');
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sending invitation to ${inviteEmail}`);
    setLastInvitedEmail(inviteEmail);
    setInviteSent(true);
    setInviteEmail('');
  };

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Manage users, investments, and analytics." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value="2,847" change="+15.3% from last month" changeType="positive" icon={Users} />
        <StatCard title="Total Investments" value="₹321 Cr" change="+24.5% from last month" changeType="positive" icon={IndianRupee} />
        <StatCard title="Total Returns" value="₹89 Cr" change="+18.7% from last month" changeType="positive" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={userGrowthOption} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={investmentOption} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite User</span>
            </button>
            <Link to="/admin/users" className="px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
              View All
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Investment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex-shrink-0 flex items-center justify-center text-white font-semibold">{user.name.charAt(0)}</div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500 md:hidden">{user.email}</div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : user.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{user.investment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><div className="flex items-center space-x-2"><button className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"><Edit2 className="w-4 h-4" /></button><button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"><Trash2 className="w-4 h-4" /></button><button className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={resetAndCloseModal}>
        {inviteSent ? (
          <div className="text-center p-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-6 animate-pulse-glow">
              <Send className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Invitation Sent!</h3>
            <p className="text-gray-600 mt-2 text-center">An invitation has been sent to <br /><span className="font-semibold text-emerald-700">{lastInvitedEmail}</span>.</p>
            <div className="mt-8 w-full space-y-3">
              <button onClick={() => setInviteSent(false)} className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700">Invite Another User</button>
              <button onClick={resetAndCloseModal} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInviteUser} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Invite New User</h2>
            <p className="text-center text-gray-600">The user will receive an email with instructions to set up their account.</p>
            <div>
              <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-2">User's Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="invite-email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="new.user@example.com" />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">Send Invitation</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
