import ReduxHelper, { ACTION } from '../../common/store/ReduxHelper';
import { RecipeAction, RecipeActionTypes, RECIPE_STORE } from '../../recipe/store/RecipeTypes';
import { RecipeFormAction, RECIPE_FORM_STORE } from '../../recipe_form/store/types';
import { BROWSER_SEARCH_STORE, SearchAction, SearchResult, SearchState } from './SearchTypes';

const defaultState: SearchState = ReduxHelper.getMapReducerDefaultState<SearchResult>(BROWSER_SEARCH_STORE);

function removeItem(state: SearchState, slug: string): SearchState {
  const upd = { ...state };
  const updItems = { ...upd.items };

  Object.keys(updItems).forEach(key => {
    const items = updItems[key];
    const recipeIx = items.recipes.findIndex(r => r.slug === slug);
    if (recipeIx !== -1) {
      items.recipes.splice(recipeIx, 1);
      items.totalRecipes -= 1;
    }
  });

  upd.items = updItems;
  return upd;
}

const searchReducer = (state = defaultState, action: SearchAction): SearchState => {
  if (action.store === RECIPE_FORM_STORE) {
    const formAction: RecipeFormAction = action as RecipeFormAction;
    switch (formAction.type) {
      case ACTION.CREATE_SUCCESS:
      case ACTION.UPDATE_SUCCESS:
        return defaultState;
      default: break;
    }
  } else if (action.store === RECIPE_STORE) {
    const formAction: RecipeAction = action as RecipeAction;
    switch (formAction.type) {
      case RecipeActionTypes.RECIPE_DELETE:
        return removeItem(state, formAction.data.slug);
      default: break;
    }
  }
  return ReduxHelper.caseMapDefaultReducer(state, action, defaultState);
};

export default searchReducer;
