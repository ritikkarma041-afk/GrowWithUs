import React from 'react';
import { Download, CreditCard, Users, Activity } from 'lucide-react';
import { faker } from '@faker-js/faker';

const invoices = Array.from({ length: 5 }, (_, i) => ({
  id: `INV-2025-${1025 - i}`,
  date: faker.date.past({ years: 1, refDate: `2025-0${5-i}-28` }).toLocaleDateString(),
  amount: faker.number.int({ min: 5000, max: 15000 }),
  status: i === 0 ? 'Paid' : 'Paid',
}));

const BillingSettings: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Platform Billing</h2>
      <p className="text-sm text-gray-500 mb-8">Manage your subscription, payment methods, and view invoices.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-1">
          <div className="p-6 border border-gray-200 rounded-lg bg-white h-full flex flex-col">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Current Plan</h3>
            <div className="flex-grow">
              <p className="text-3xl font-bold text-emerald-600">Enterprise</p>
              <p className="text-gray-600 mt-2">₹15,000 / month</p>
              <p className="text-sm text-gray-500 mt-4">Your plan includes unlimited users, advanced analytics, and priority support.</p>
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Change Plan</button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Update Payment Method</button>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="lg:col-span-2">
          <div className="p-6 border border-gray-200 rounded-lg bg-white h-full">
            <h3 className="text-lg font-medium text-gray-800 mb-4">This Month's Usage</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Active Users</span>
                  <span className="text-gray-500">2,847 / Unlimited</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '60%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Transactions Processed</span>
                  <span className="text-gray-500">15,230 / Unlimited</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '75%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">API Calls</span>
                  <span className="text-gray-500">8.2M / 10M</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '82%' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Invoice History</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{invoice.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{invoice.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-emerald-600 hover:text-emerald-800 flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
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

export default BillingSettings;
