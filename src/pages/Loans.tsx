import React, { useState } from 'react';
import { Building, CreditCard, Calendar, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/modals/Modal';
import LoanForm from '../components/loans/LoanForm';
import LoanList from '../components/loans/LoanList';

interface Loan {
  id: string;
  bankName: string;
  amount: number;
  installments: number;
  remainingInstallments: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  nextPaymentDate: string;
  notes?: string;
}

const mockLoans: Loan[] = [
  {
    id: '1',
    bankName: 'Ziraat Bankası',
    amount: 50000,
    installments: 36,
    remainingInstallments: 24,
    monthlyPayment: 1800,
    interestRate: 1.89,
    startDate: '2023-06-15',
    nextPaymentDate: '2024-03-15',
    notes: 'İhtiyaç kredisi'
  },
  {
    id: '2',
    bankName: 'Yapı Kredi',
    amount: 25000,
    installments: 24,
    remainingInstallments: 18,
    monthlyPayment: 1250,
    interestRate: 1.95,
    startDate: '2023-09-01',
    nextPaymentDate: '2024-03-01'
  }
];

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const totalDebt = loans.reduce((sum, loan) => 
    sum + (loan.monthlyPayment * loan.remainingInstallments), 0
  );

  const monthlyTotal = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const handleAddLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loan,
      id: Math.random().toString(36).substr(2, 9)
    };
    setLoans([...loans, newLoan]);
    setIsFormOpen(false);
  };

  const handleEditLoan = (loan: Omit<Loan, 'id'>) => {
    if (!selectedLoan) return;
    
    const updatedLoans = loans.map(l => 
      l.id === selectedLoan.id ? { ...loan, id: selectedLoan.id } : l
    );
    setLoans(updatedLoans);
    setSelectedLoan(null);
    setIsFormOpen(false);
  };

  const handleDeleteLoan = () => {
    if (!selectedLoan) return;
    
    const updatedLoans = loans.filter(loan => loan.id !== selectedLoan.id);
    setLoans(updatedLoans);
    setSelectedLoan(null);
    setIsDeleteModalOpen(false);
  };

  const handlePayment = (loanId: string) => {
    setLoans(loans.map(loan => {
      if (loan.id === loanId && loan.remainingInstallments > 0) {
        const nextDate = new Date(loan.nextPaymentDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        
        return {
          ...loan,
          remainingInstallments: loan.remainingInstallments - 1,
          nextPaymentDate: nextDate.toISOString().split('T')[0]
        };
      }
      return loan;
    }));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Kredi Takibi</h1>
            <p className="text-gray-600">Aktif kredilerinizi ve ödemelerinizi yönetin</p>
          </div>
          <button
            onClick={() => {
              setSelectedLoan(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Kredi Ekle
          </button>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Aktif Krediler</h3>
            </div>
            <p className="text-2xl font-semibold">{loans.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Aylık Toplam Ödeme</h3>
            </div>
            <p className="text-2xl font-semibold text-amber-600">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(monthlyTotal)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-emerald-500" />
              <h3 className="font-medium">Toplam Borç</h3>
            </div>
            <p className="text-2xl font-semibold text-red-600">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalDebt)}
            </p>
          </div>
        </div>

        <LoanList 
          loans={loans} 
          onPayment={handlePayment}
          onEdit={(loan) => {
            setSelectedLoan(loan);
            setIsFormOpen(true);
          }}
          onDelete={(loan) => {
            setSelectedLoan(loan);
            setIsDeleteModalOpen(true);
          }}
        />

        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedLoan(null);
          }}
          title={selectedLoan ? 'Kredi Düzenle' : 'Yeni Kredi Ekle'}
        >
          <LoanForm 
            onSubmit={selectedLoan ? handleEditLoan : handleAddLoan}
            initialValues={selectedLoan || undefined}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedLoan(null);
          }}
          title="Kredi Sil"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 text-amber-600 bg-amber-50 p-4 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
              <p className="text-sm">
                Bu krediyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedLoan(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteLoan}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Loans;