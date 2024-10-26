import OpenAI from 'openai';
import type { Transaction } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

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
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sen bir finansal danışmansın. Verilen finansal verileri analiz edip, kullanıcıya faydalı öneriler sunacaksın."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('AI yanıtı boş');

    // AI yanıtını parse et
    const sections = content.split('\n\n');
    
    return {
      summary: sections[0],
      recommendations: sections[1].split('\n').filter(s => s.trim()),
      trends: sections[2].split('\n').filter(s => s.trim()),
      alerts: sections[3].split('\n').filter(s => s.trim())
    };
  } catch (error) {
    console.error('AI analizi sırasında hata:', error);
    throw new Error('Finansal analiz yapılırken bir hata oluştu');
  }
}