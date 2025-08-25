import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Edit2, Trash2, MoreHorizontal, UserPlus, Check } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { faker } from '@faker-js/faker';
import { useClickOutside } from '../../hooks/useClickOutside';

type UserStatus = 'Active' | 'Inactive' | 'Pending';
type SortByType = 'name' | 'joinDate' | 'investment';

const mockUsers = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement<UserStatus>(['Active', 'Inactive', 'Pending']),
    joinDate: faker.date.recent({ days: 365 }).toISOString(),
    lastLogin: faker.date.recent({ days: 30 }).toISOString(),
    investment: faker.number.int({ min: 100000, max: 5000000 })
}));

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortByType>('joinDate');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const filterRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterRef, () => setIsFilterOpen(false));

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = mockUsers
      .filter(user => {
        const term = searchTerm.toLowerCase();
        return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
      })
      .filter(user => {
        return filterStatus === 'All' || user.status === filterStatus;
      });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'investment':
          return b.investment - a.investment;
        default:
          return 0;
      }
    });
  }, [searchTerm, filterStatus, sortBy]);

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const sortOptions = [
    { id: 'joinDate', label: 'Join Date' },
    { id: 'name', label: 'Name' },
    { id: 'investment', label: 'Investment Amount' },
  ];

  const statusOptions: (UserStatus | 'All')[] = ['All', 'Active', 'Inactive', 'Pending'];

  return (
    <div>
      <PageHeader title="User Management" subtitle="View, manage, and invite users to the platform." />

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search users by name or email..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full md:w-80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-10 p-4 animate-fade-in">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Filter by Status</h4>
                  <div className="space-y-1">
                    {statusOptions.map(status => (
                      <button key={status} onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }} className="w-full text-left flex items-center justify-between text-sm p-2 rounded-md hover:bg-emerald-50">
                        <span>{status === 'All' ? 'All Statuses' : status}</span>
                        {filterStatus === status && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                  
                  <hr className="my-3" />

                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Sort By</h4>
                  <div className="space-y-1">
                    {sortOptions.map(sortOption => (
                      <button key={sortOption.id} onClick={() => { setSortBy(sortOption.id as SortByType); setIsFilterOpen(false); }} className="w-full text-left flex items-center justify-between text-sm p-2 rounded-md hover:bg-emerald-50">
                        <span>{sortOption.label}</span>
                        {sortBy === sortOption.id && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/admin/users/add">
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Investment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} onClick={() => navigate(`/admin/users/${user.id}`)} className="hover:bg-emerald-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex-shrink-0 flex items-center justify-center text-white font-semibold">{user.name.charAt(0)}</div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : user.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">₹{user.investment.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={(e) => handleActionClick(e, () => console.log('Edit user', user.id))} className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={(e) => handleActionClick(e, () => console.log('Delete user', user.id))} className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={(e) => handleActionClick(e, () => console.log('More actions for user', user.id))} className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
