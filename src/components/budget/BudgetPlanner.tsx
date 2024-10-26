import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Budget } from '../../types';

interface BudgetPlannerProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ budgets, onAddBudget }) => {
  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    categoryId: '',
    amount: 0,
    period: 'monthly' as const,
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBudget({
      ...newBudget,
      userId: 'user1', // This should come from auth context
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Budget Planning</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={newBudget.categoryId}
              onChange={(e) => setNewBudget(prev => ({ ...prev, categoryId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Select a category</option>
              <option value="groceries">Groceries</option>
              <option value="rent">Rent</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={newBudget.amount}
              onChange={(e) => setNewBudget(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              value={newBudget.period}
              onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={newBudget.startDate}
              onChange={(e) => setNewBudget(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Budget
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{budget.categoryId}</h3>
              <span className="text-sm text-gray-500">{budget.period}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Budget</span>
                <span className="font-medium">${budget.amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{ width: '45%' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Spent: $450</span>
                <span className="text-gray-500">Remaining: $550</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPlanner;