import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
}

export interface SavingsAdviceRequest {
  income: number;
  expenses: number;
}

export interface SavingsAdviceResponse {
  advice: string;
}

export const apiService = {
  async getNews(category: string = 'all'): Promise<NewsResponse> {
    const response = await api.get<NewsResponse>(`/news?category=${category}`);
    return response.data;
  },

  async sendChatMessage(message: string): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/chat', { message });
    return response.data;
  },

  async getSavingsAdvice(income: number, expenses: number): Promise<SavingsAdviceResponse> {
    const response = await api.post<SavingsAdviceResponse>('/savings/advice', {
      income,
      expenses,
    });
    return response.data;
  },

  async makePhoneCall(phoneNumber: string): Promise<{ message: string; call_sid: string }> {
    const response = await api.post<{ message: string; call_sid: string }>('/call', {
      phone_number: phoneNumber,
    });
    return response.data;
  },
};

export default api;
