import React from 'react';
import { Brain, AlertTriangle } from 'lucide-react';

interface AIAnalysisCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'error';
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ 
  title, 
  icon, 
  children, 
  variant = 'default' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-50 text-amber-800';
      case 'error':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-emerald-50 text-emerald-800';
    }
  };

  return (
    <div className={`rounded-lg p-4 ${getVariantStyles()}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      {children}
    </div>
  );
};

export default AIAnalysisCard;