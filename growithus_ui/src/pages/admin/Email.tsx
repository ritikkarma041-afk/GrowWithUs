import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const AdminEmail: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending email:', { recipient, subject, body });
    // Simulate sending email
    setIsSent(true);
    // Reset form after a delay
    setTimeout(() => {
      setIsSent(false);
      setRecipient('');
      setSubject('');
      setBody('');
    }, 3000);
  };

  return (
    <div>
      <PageHeader title="Email Composer" subtitle="Send emails directly to users or external addresses." />

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 sm:p-8">
        {isSent ? (
          <div className="text-center py-16 flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-6 animate-pulse-glow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Email Sent!</h3>
            <p className="text-gray-600 mt-2">Your message to <span className="font-medium text-emerald-700">{recipient}</span> has been sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
              <input 
                id="recipient" 
                type="email" 
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="user@example.com" 
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input 
                id="subject" 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Regarding your account..." 
              />
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
              <textarea 
                id="body" 
                rows={10}
                value={body}
                onChange={e => setBody(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Dear user..." 
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Email</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminEmail;
