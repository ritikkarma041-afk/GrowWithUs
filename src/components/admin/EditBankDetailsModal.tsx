import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { Landmark } from 'lucide-react';

interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  status: string;
}

interface EditBankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: Omit<BankAccount, 'status'>) => void;
  bankDetails: BankAccount;
}

const EditBankDetailsModal: React.FC<EditBankDetailsModalProps> = ({ isOpen, onClose, onSave, bankDetails }) => {
  const [details, setDetails] = useState(bankDetails);

  useEffect(() => {
    if (isOpen) {
      setDetails(bankDetails);
    }
  }, [bankDetails, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { status, ...detailsToSave } = details;
    onSave(detailsToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          <Landmark className="w-8 h-8 mb-3 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">Edit Bank Details</h2>
        </div>
        
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
          <input id="bankName" name="bankName" type="text" value={details.bankName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
          <input id="accountNumber" name="accountNumber" type="text" value={details.accountNumber} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
          <input id="ifsc" name="ifsc" type="text" value={details.ifsc} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBankDetailsModal;
