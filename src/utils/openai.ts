import OpenAI from 'openai';
import type { NewsItem, Language } from '../types/news';

const getPromptByLanguage = (lang: Language, item: NewsItem, numbers: string[], comparisons: string[]) => {
  if (lang === 'fr') {
    return `Analysez cette actualité financière avec les détails suivants:

Titre: ${item.title}

Points clés:
${item.description}

Considérez:
1. Changements numériques: ${numbers.join(', ')}
2. Comparaisons avec les estimations: ${comparisons.join(', ')}

Fournissez une analyse de trading concise en vous concentrant sur:
1. Impact sur le marché: Quel est l'effet immédiat sur les marchés concernés?
2. Direction du trading: Biais clair d'achat/vente basé sur les données
3. Raisonnement clé: Point de données le plus important soutenant cette vue
4. Horizon temporel: Immédiat (heures), Court (jours) ou Moyen (semaines)

Gardez l'analyse brève et exploitable.`;
  }

  return `Analyze this financial news with the following details:

Title: ${item.title}

Key Data Points:
${item.description}

Consider:
1. Numerical Changes: ${numbers.join(', ')}
2. Comparisons to Estimates: ${comparisons.join(', ')}

Provide a concise trading analysis focusing on:
1. Market Impact: What's the immediate effect on relevant markets?
2. Trading Direction: Clear buy/sell bias based on the data
3. Key Reasoning: Most important data point supporting this view
4. Timeframe: Immediate (hours), Short (days), or Medium (weeks)

Keep it brief and actionable.`;
};

export const analyzeNewsItem = async (apiKey: string, item: NewsItem, language: Language = 'en') => {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  // Extract numerical data from description
  const numbers = item.description.match(/\d+(\.\d+)?/g) || [];
  const comparisons = item.description.match(/(?:vs|versus)\s+[-\d.]+/g) || [];
  
  const prompt = getPromptByLanguage(language, item, numbers, comparisons);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};