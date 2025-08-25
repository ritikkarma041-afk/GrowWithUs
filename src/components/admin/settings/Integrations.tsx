import React from 'react';
import { Slack, Zap, BarChart, MessageSquare } from 'lucide-react'; // Assuming Zap is a valid icon or using a placeholder

const integrations = [
  {
    name: 'Slack',
    description: 'Send real-time notifications to your Slack channels.',
    icon: Slack,
    connected: true,
  },
  {
    name: 'Stripe',
    description: 'Integrate with Stripe for seamless payment processing.',
    icon: BarChart, // Placeholder
    connected: false,
  },
  {
    name: 'Intercom',
    description: 'Connect with Intercom for customer support and messaging.',
    icon: MessageSquare,
    connected: false,
  },
  {
    name: 'Zapier',
    description: 'Connect to thousands of other apps with Zapier.',
    icon: Zap,
    connected: false,
  },
];

const Integrations: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Integrations</h2>
      <p className="text-sm text-gray-500 mb-8">Connect GrowWithUs to your favorite third-party services.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <div key={integration.name} className="p-6 border border-gray-200 rounded-lg flex items-start space-x-4 bg-white">
            <div className="p-3 bg-gray-100 rounded-lg">
              <integration.icon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">{integration.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
            </div>
            <button 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                integration.connected 
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {integration.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
