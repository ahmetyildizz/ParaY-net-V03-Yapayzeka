import React, { useState } from 'react';
import { Plus, Minus, Users } from 'lucide-react';
import type { SharedExpense } from '../../types';

interface SharedExpenseFormProps {
  onSubmit: (expense: Omit<SharedExpense, 'id'>) => void;
}

const SharedExpenseForm: React.FC<SharedExpenseFormProps> = ({ onSubmit }) => {
  const [participants, setParticipants] = useState([
    { userId: '', share: 0, status: 'pending' as const }
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleAddParticipant = () => {
    setParticipants([...participants, { userId: '', share: 0, status: 'pending' }]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, field: 'userId' | 'share', value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = {
      ...newParticipants[index],
      [field]: field === 'share' ? parseFloat(value) : value
    };
    setParticipants(newParticipants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      transactionId: Math.random().toString(36).substr(2, 9),
      participants,
      totalAmount,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Participants</h3>
          <button
            type="button"
            onClick={handleAddParticipant}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Participant
          </button>
        </div>

        {participants.map((participant, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">User</label>
              <input
                type="text"
                value={participant.userId}
                onChange={(e) => handleParticipantChange(index, 'userId', e.target.value)}
                className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="User ID"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Share Amount</label>
              <input
                type="number"
                value={participant.share}
                onChange={(e) => handleParticipantChange(index, 'share', e.target.value)}
                className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveParticipant(index)}
                className="mt-6 p-2 text-red-600 hover:text-red-700"
              >
                <Minus className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="w-full btn btn-primary">
        Create Shared Expense
      </button>
    </form>
  );
};

export default SharedExpenseForm;