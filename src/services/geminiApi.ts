import { ArticleAnalysis, ComparisonData, NewsArticle } from '../types';
import { API_ENDPOINTS, API_KEYS } from '../utils/constants';

export class GeminiApiService {
  private apiKey = API_KEYS.GEMINI_API;
  private baseUrl = API_ENDPOINTS.GEMINI_API;

  async analyzeArticle(article: NewsArticle): Promise<ArticleAnalysis> {
    try {
      const prompt = `
        Analyze the following news article for political bias and tone:
        
        Title: ${article.title}
        Description: ${article.description}
        Source: ${article.source.name}
        
        Please provide:
        1. Political leaning (liberal, conservative, or centrist)
        2. Tone (neutral, biased, or emotionally-charged)
        3. Three bullet points summarizing the article
        4. One sentence showing how the opposing ideology might frame this story
        5. Sentiment score from -1 (very negative) to 1 (very positive)
        6. Factual score from 0 (opinion-heavy) to 1 (fact-based)
        7. Bias score from -1 (liberal bias) to 1 (conservative bias)
        
        Format your response as JSON with these exact keys:
        {
          "politicalLeaning": "liberal|conservative|centrist",
          "tone": "neutral|biased|emotionally-charged",
          "summary": ["point1", "point2", "point3"],
          "opposingFraming": "opposing viewpoint sentence",
          "sentiment": 0.5,
          "factualScore": 0.8,
          "biasScore": -0.2
        }
      `;

      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze article');
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      try {
        const analysis = JSON.parse(content);
        return analysis;
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        return this.getMockAnalysis();
      }
    } catch (error) {
      console.error('Error analyzing article:', error);
      return this.getMockAnalysis();
    }
  }

  async compareArticles(article1: NewsArticle, article2: NewsArticle): Promise<ComparisonData> {
    try {
      const prompt = `
        Compare these two news articles about the same topic:
        
        Article 1:
        Title: ${article1.title}
        Description: ${article1.description}
        Source: ${article1.source.name}
        
        Article 2:
        Title: ${article2.title}
        Description: ${article2.description}
        Source: ${article2.source.name}
        
        Please provide:
        1. Key framing differences between the articles
        2. How each article emphasizes different facts
        3. Language and tone contrasts
        4. Overall framing verdict comparing their approaches
        
        Format as JSON:
        {
          "framingDifferences": ["difference1", "difference2"],
          "keyFactEmphasis": ["emphasis1", "emphasis2"],
          "languageContrasts": ["contrast1", "contrast2"],
          "verdict": "overall comparison summary"
        }
      `;

      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to compare articles');
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      try {
        const comparison = JSON.parse(content);
        return {
          article1,
          article2,
          ...comparison
        };
      } catch (parseError) {
        console.error('Failed to parse comparison response:', parseError);
        return this.getMockComparison(article1, article2);
      }
    } catch (error) {
      console.error('Error comparing articles:', error);
      return this.getMockComparison(article1, article2);
    }
  }

  private getMockAnalysis(): ArticleAnalysis {
    const leanings: Array<'liberal' | 'conservative' | 'centrist'> = ['liberal', 'conservative', 'centrist'];
    const tones: Array<'neutral' | 'biased' | 'emotionally-charged'> = ['neutral', 'biased', 'emotionally-charged'];
    
    return {
      politicalLeaning: leanings[Math.floor(Math.random() * leanings.length)],
      tone: tones[Math.floor(Math.random() * tones.length)],
      summary: [
        'Key policy implications discussed in detail',
        'Multiple stakeholder perspectives presented',
        'Economic and social factors analyzed'
      ],
      opposingFraming: 'Critics argue this approach could lead to unintended economic consequences.',
      sentiment: (Math.random() - 0.5) * 2,
      factualScore: Math.random() * 0.4 + 0.6,
      biasScore: (Math.random() - 0.5) * 2
    };
  }

  private getMockComparison(article1: NewsArticle, article2: NewsArticle): ComparisonData {
    return {
      article1,
      article2,
      framingDifferences: [
        'Article 1 emphasizes economic benefits while Article 2 focuses on potential risks',
        'Different expert sources cited to support opposing viewpoints'
      ],
      keyFactEmphasis: [
        'Article 1 highlights statistical improvements in key metrics',
        'Article 2 emphasizes historical precedents and cautionary examples'
      ],
      languageContrasts: [
        'Article 1 uses optimistic language ("breakthrough", "progress")',
        'Article 2 employs more cautious terminology ("concerns", "challenges")'
      ],
      verdict: 'These articles demonstrate how the same policy can be framed differently depending on ideological perspective and source priorities.'
    };
  }
}

export const geminiApi = new GeminiApiService();