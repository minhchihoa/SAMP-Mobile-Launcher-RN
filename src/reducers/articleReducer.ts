import { ArticleActionsType } from '../actions/articleActions';
import { ArticleType } from '../services/article.service';

const articleInitState = {
  articles: [] as ArticleType[],
};

export type ArticleStateType = typeof articleInitState;

export const articleReducer = (
  state: ArticleStateType = articleInitState,
  action: ArticleActionsType,
): ArticleStateType => {
  switch (action.type) {
    case 'SET_ARTICLES':
      return {
        ...state,
        articles: action.payload.articles ?? [],
      };

    default:
      return state;
  }
};
