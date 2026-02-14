import { URL_NEWS_API } from '@env';
import axios from 'axios';

export const ArticleService = {
  async get() {
    try {
      const response = await axios.get<ArticleType[]>(URL_NEWS_API);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return []; // Return an empty array on error to prevent crashes
    }
  },
};

export type ArticleType = {
  title: string;
  image: string;
  slug: string;
  description: string;
  created_at: string;
  link?: string; // Optional link from MySQL
};
