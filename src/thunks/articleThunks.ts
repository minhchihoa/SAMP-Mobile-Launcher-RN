import { setArticles } from '../actions/articleActions';
import { ArticleService } from '../services/article.service';
import { AppThunk } from '../store/store';

export const fetchArticles = (): AppThunk => async dispatch => {
  try {
    const articles = await ArticleService.get();
    // Add defensive check to prevent crash
    if (Array.isArray(articles)) {
        // Normalize data to ensure no nulls cause crashes
        const safeArticles = articles.map(a => ({
          title: String(a.title || ''),
          image: String(a.image || ''),
          slug: String(a.slug || ''),
          description: String(a.description || ''),
          created_at: String(a.created_at || ''),
          link: a.link ? String(a.link) : undefined,
        }));
        dispatch(setArticles({ articles: safeArticles }));
    } else {
        console.error('Invalid response from ArticleService.get():', articles);
        dispatch(setArticles({ articles: [] })); // Dispatch empty array on error
    }
  } catch (e) {
    console.error("Error fetching articles:", e);
    dispatch(setArticles({ articles: [] })); // Dispatch empty array on error
  }
};
