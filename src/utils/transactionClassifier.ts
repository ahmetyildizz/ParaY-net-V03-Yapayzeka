import type { Transaction } from '../types';

interface CategoryPattern {
  keywords: string[];
  category: string;
  type: 'income' | 'expense';
}

class SmartClassifier {
  private patterns: CategoryPattern[] = [
    { keywords: ['maaş', 'salary', 'ücret'], category: 'Maaş', type: 'income' },
    { keywords: ['market', 'grocery', 'migros', 'carrefour'], category: 'Market', type: 'expense' },
    { keywords: ['kira', 'rent', 'aidat'], category: 'Kira', type: 'expense' },
    { keywords: ['elektrik', 'su', 'doğalgaz', 'internet'], category: 'Faturalar', type: 'expense' },
    { keywords: ['sinema', 'tiyatro', 'konser'], category: 'Eğlence', type: 'expense' },
    { keywords: ['taksi', 'metro', 'otobüs', 'ulaşım'], category: 'Ulaşım', type: 'expense' }
  ];

  private learningPatterns: Map<string, { category: string; confidence: number }> = new Map();
  private frequentTransactions: Map<string, number> = new Map();

  predict(description: string, amount: number): { 
    category: string; 
    confidence: number;
    type: 'income' | 'expense';
  } {
    const normalizedDesc = description.toLowerCase();
    
    // Öğrenilmiş kalıplardan kontrol
    const learned = this.learningPatterns.get(normalizedDesc);
    if (learned && learned.confidence > 0.8) {
      return { 
        category: learned.category, 
        confidence: learned.confidence,
        type: amount >= 0 ? 'income' : 'expense'
      };
    }

    // Yerleşik kalıplardan kontrol
    for (const pattern of this.patterns) {
      if (pattern.keywords.some(keyword => normalizedDesc.includes(keyword))) {
        return { 
          category: pattern.category, 
          confidence: 0.9,
          type: pattern.type
        };
      }
    }

    // Tutar bazlı tahmin
    if (amount > 5000) {
      return { category: 'Büyük Harcamalar', confidence: 0.6, type: 'expense' };
    }

    return { category: 'Diğer', confidence: 0.3, type: 'expense' };
  }

  learn(transaction: Transaction): void {
    if (!transaction.description || !transaction.category) return;

    const key = transaction.description.toLowerCase();
    const existing = this.learningPatterns.get(key);

    if (existing) {
      // Güven skorunu artır
      this.learningPatterns.set(key, {
        category: transaction.category,
        confidence: Math.min(existing.confidence + 0.1, 1)
      });
    } else {
      // Yeni kalıp ekle
      this.learningPatterns.set(key, {
        category: transaction.category,
        confidence: 0.5
      });
    }

    // Sık tekrarlanan işlemleri takip et
    this.frequentTransactions.set(key, (this.frequentTransactions.get(key) || 0) + 1);
  }

  findSimilarTransactions(description: string, transactions: Transaction[]): Transaction[] {
    const normalizedDesc = description.toLowerCase();
    const words = normalizedDesc.split(' ');

    return transactions
      .filter(t => {
        if (!t.description) return false;
        const transDesc = t.description.toLowerCase();
        return words.some(word => transDesc.includes(word));
      })
      .sort((a, b) => {
        const scoreA = this.calculateRelevanceScore(a, normalizedDesc);
        const scoreB = this.calculateRelevanceScore(b, normalizedDesc);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }

  private calculateRelevanceScore(transaction: Transaction, query: string): number {
    if (!transaction.description) return 0;

    const transDesc = transaction.description.toLowerCase();
    const frequency = this.frequentTransactions.get(transDesc) || 0;
    const similarity = this.calculateSimilarity(query, transDesc);

    // Sıklık ve benzerlik skorlarını kombine et
    return (similarity * 0.7) + (Math.min(frequency / 10, 1) * 0.3);
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.split(' '));
    const words2 = new Set(str2.split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  getSpendingPatterns(transactions: Transaction[]): {
    frequentCategories: { category: string; count: number }[];
    averageAmounts: { category: string; amount: number }[];
    periodicTransactions: Transaction[];
  } {
    const categoryFrequency = new Map<string, number>();
    const categoryTotals = new Map<string, number>();
    const transactionDates = new Map<string, Date[]>();

    transactions.forEach(t => {
      if (t.category) {
        categoryFrequency.set(t.category, (categoryFrequency.get(t.category) || 0) + 1);
        categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount);
      }
      if (t.description) {
        const dates = transactionDates.get(t.description) || [];
        dates.push(new Date(t.date));
        transactionDates.set(t.description, dates);
      }
    });

    // En sık kategoriler
    const frequentCategories = Array.from(categoryFrequency.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Kategori bazında ortalama tutarlar
    const averageAmounts = Array.from(categoryTotals.entries())
      .map(([category, total]) => ({
        category,
        amount: total / (categoryFrequency.get(category) || 1)
      }))
      .sort((a, b) => b.amount - a.amount);

    // Periyodik işlemleri tespit et
    const periodicTransactions = transactions.filter(t => {
      if (!t.description) return false;
      const dates = transactionDates.get(t.description) || [];
      if (dates.length < 3) return false;

      // Tarihler arasındaki ortalama farkı hesapla
      const intervals = dates
        .sort((a, b) => a.getTime() - b.getTime())
        .slice(1)
        .map((date, i) => date.getTime() - dates[i].getTime());

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals
        .map(i => Math.pow(i - avgInterval, 2))
        .reduce((a, b) => a + b, 0) / intervals.length;

      // Düşük varyans periyodik işlemi gösterir
      return Math.sqrt(variance) < avgInterval * 0.2;
    });

    return {
      frequentCategories: frequentCategories.slice(0, 5),
      averageAmounts: averageAmounts.slice(0, 5),
      periodicTransactions: periodicTransactions.slice(0, 5)
    };
  }
}

export class TransactionClassifier {
  private classifier: SmartClassifier;
  private static instance: TransactionClassifier;

  private constructor() {
    this.classifier = new SmartClassifier();
  }

  static getInstance(): TransactionClassifier {
    if (!TransactionClassifier.instance) {
      TransactionClassifier.instance = new TransactionClassifier();
    }
    return TransactionClassifier.instance;
  }

  trainWithHistoricalData(transactions: Transaction[]): void {
    transactions.forEach(transaction => {
      this.classifier.learn(transaction);
    });
  }

  suggestCategory(description: string, amount: number): {
    category: string;
    confidence: number;
    type: 'income' | 'expense';
  } {
    return this.classifier.predict(description, amount);
  }

  findSimilarTransactions(description: string, transactions: Transaction[]): Transaction[] {
    return this.classifier.findSimilarTransactions(description, transactions);
  }

  analyzeSpendingPatterns(transactions: Transaction[]) {
    return this.classifier.getSpendingPatterns(transactions);
  }
}