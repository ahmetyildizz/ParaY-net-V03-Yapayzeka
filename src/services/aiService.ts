import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeTransactions(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    acc[t.category] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
    Finansal verileri analiz et ve Türkçe yanıt ver:
    
    Toplam Gelir: ${totalIncome} TL
    Toplam Gider: ${totalExpenses} TL
    
    Kategori Bazında Harcamalar:
    ${Object.entries(categories)
      .map(([category, amount]) => `${category}: ${amount} TL`)
      .join('\n')}
    
    Lütfen şunları yap:
    1. Finansal durumun kısa bir özetini çıkar
    2. Tasarruf ve harcama konusunda 3-4 somut öneri ver
    3. Önemli trendleri belirt
    4. Varsa dikkat edilmesi gereken noktaları listele
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Yanıtı bölümlere ayır
    const sections = text.split('\n\n');
    
    return {
      summary: sections[0] || 'Özet bilgi yok',
      recommendations: (sections[1] || '').split('\n').filter(s => s.trim()),
      trends: (sections[2] || '').split('\n').filter(s => s.trim()),
      alerts: (sections[3] || '').split('\n').filter(s => s.trim())
    };
  } catch (error) {
    console.error('AI analizi sırasında hata:', error);
    throw new Error('Finansal analiz yapılırken bir hata oluştu');
  }
}