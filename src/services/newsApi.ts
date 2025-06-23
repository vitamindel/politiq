import { NewsArticle, NewsSource } from '../types';
import { API_ENDPOINTS, API_KEYS } from '../utils/constants';

export class NewsApiService {
  private apiKey = API_KEYS.NEWS_API;
  private baseUrl = API_ENDPOINTS.NEWS_API;

  async getTopHeadlines(topic?: string, sources?: string[]): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({
        apiKey: this.apiKey,
        country: 'us',
        category: 'politics',
        pageSize: '20'
      });

      if (topic) {
        params.append('q', topic);
      }

      if (sources && sources.length > 0) {
        params.append('sources', sources.join(','));
      }

      const response = await fetch(`${this.baseUrl}/top-headlines?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      return data.articles.map((article: any) => ({
        id: `${article.source.id}-${Date.now()}-${Math.random()}`,
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        source: {
          id: article.source.id || 'unknown',
          name: article.source.name || 'Unknown Source',
          category: 'politics',
          language: 'en',
          country: 'us'
        },
        publishedAt: article.publishedAt,
        url: article.url,
        urlToImage: article.urlToImage,
        author: article.author
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return mock data for development
      return this.getMockNews();
    }
  }

  async searchNews(query: string, from?: string, to?: string): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({
        apiKey: this.apiKey,
        q: query,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: '20'
      });

      if (from) params.append('from', from);
      if (to) params.append('to', to);

      const response = await fetch(`${this.baseUrl}/everything?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to search news');
      }

      const data = await response.json();
      
      return data.articles.map((article: any) => ({
        id: `${article.source.id}-${Date.now()}-${Math.random()}`,
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        source: {
          id: article.source.id || 'unknown',
          name: article.source.name || 'Unknown Source',
          category: 'politics',
          language: 'en',
          country: 'us'
        },
        publishedAt: article.publishedAt,
        url: article.url,
        urlToImage: article.urlToImage,
        author: article.author
      }));
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getMockNews();
    }
  }

  private getMockNews(): NewsArticle[] {
    return [
      {
        id: 'mock-1',
        title: 'Economic Policy Debate Intensifies in Congress',
        description: 'Lawmakers debate new economic measures amid rising inflation concerns.',
        content: 'Congressional leaders are engaged in heated discussions about economic policy...',
        source: {
          id: 'reuters',
          name: 'Reuters',
          category: 'politics',
          language: 'en',
          country: 'us'
        },
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/article-1',
        urlToImage: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: 'Political Reporter'
      },
      {
        id: 'mock-2',
        title: 'Climate Change Legislation Faces Senate Vote',
        description: 'Environmental groups push for swift action on climate bill.',
        content: 'The Senate is preparing for a crucial vote on climate legislation...',
        source: {
          id: 'cnn',
          name: 'CNN',
          category: 'politics',
          language: 'en',
          country: 'us'
        },
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: 'https://example.com/article-2',
        urlToImage: 'https://images.pexels.com/photos/9324659/pexels-photo-9324659.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: 'Environmental Correspondent'
      },
      {
        id: 'mock-3',
        title: 'Healthcare Reform Proposals Gain Momentum',
        description: 'Bipartisan support emerges for healthcare system changes.',
        content: 'Healthcare reform is gaining traction in both parties...',
        source: {
          id: 'bbc',
          name: 'BBC News',
          category: 'politics',
          language: 'en',
          country: 'us'
        },
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: 'https://example.com/article-3',
        urlToImage: 'https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: 'Health Policy Reporter'
      }
    ];
  }
}

export const newsApi = new NewsApiService();