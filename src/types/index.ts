export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  preferences?: {
    currency: string;
    language: string;
    notifications: boolean;
    theme?: 'light' | 'dark';
  };
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string;
  isShared: boolean;
  sharedWith?: string[];
  recurringType?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  attachments?: string[];
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense';
  color: string;
  parentId?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  alerts?: {
    threshold: number;
    type: 'percentage' | 'amount';
  }[];
}

export interface SharedExpense {
  id: string;
  transactionId: string;
  participants: {
    userId: string;
    share: number;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  totalAmount: number;
  settledDate?: string;
}