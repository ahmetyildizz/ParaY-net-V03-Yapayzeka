import React from 'react';

interface AIAnalysisListProps {
  items: string[];
  bulletColor?: string;
}

const AIAnalysisList: React.FC<AIAnalysisListProps> = ({ 
  items, 
  bulletColor = 'text-emerald-500' 
}) => {
  if (!items.length) return null;

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-gray-700">
          <span className={`${bulletColor} mt-1`}>•</span>
          {item}
        </li>
      ))}
    </ul>
  );
};

export default AIAnalysisList;