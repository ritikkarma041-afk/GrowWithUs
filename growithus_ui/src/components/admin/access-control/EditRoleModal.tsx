import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Role } from '../../../data/accessControlData';
import { Edit } from 'lucide-react';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, name: string, description: string) => void;
  role: Role;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, onEdit, role }) => {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);

  useEffect(() => {
    if (isOpen) {
      setName(role.name);
      setDescription(role.description);
    }
  }, [isOpen, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onEdit(role.id, name, description);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <Edit className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Edit Role</h2>
        </div>
        <div>
          <label htmlFor="editRoleName" className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
          <input
            id="editRoleName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="editRoleDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            id="editRoleDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoleModal;
