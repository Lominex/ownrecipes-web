import * as _ from 'lodash';
import { PendingState } from '../../common/store/GenericReducerType';

import ReduxHelper, { ACTION } from '../../common/store/ReduxHelper';
import { Recipe } from '../../recipe/store/RecipeTypes';
import { RecipeFormAction, RecipeFormActionTypes, RecipeFormState, RECIPE_FORM_STORE } from './types';
import ingredient, { RecipeIngredientReducerActionTypes, RECIPE_INGREDIENTS_STORE } from '../../recipe/store/IngredientReducer';
import subrecipes, { RecipeSubrecipesReducerActionTypes, RECIPE_SUBRECIPES_STORE } from '../../recipe/store/SubRecipeReducer';
import fq from '../../recipe/utilts/formatQuantity';

const defaultState: RecipeFormState = ReduxHelper.getItemReducerDefaultState(RECIPE_FORM_STORE) as RecipeFormState;

const reducer = (state = defaultState, action: RecipeFormAction): RecipeFormState => {
  if (RECIPE_FORM_STORE === action.store) {
    switch (action.type) {
      case ACTION.GET_SUCCESS:
        {
          const actionRecipe = action.data;

          const isNew = state.item == null || state.item.id !== actionRecipe.id || state.item.ingredientGroups == null;
          const updServings = isNew ? actionRecipe.servings : (state.item?.customServings ?? 1);
          const subRecipes = subrecipes(
            [],
            { subrecipes:     actionRecipe.subrecipes,
              formatQuantity: fq.bind(this, updServings, actionRecipe.servings),
              store: RECIPE_SUBRECIPES_STORE,
              type:  RecipeSubrecipesReducerActionTypes.RECIPE_SUBRECIPES_LOAD }
          );
          const ingredients = ingredient(
            [],
            { ingredientGroups: actionRecipe.ingredientGroups,
              formatQuantity:   fq.bind(this, updServings, actionRecipe.servings),
              store: RECIPE_INGREDIENTS_STORE,
              type:  RecipeIngredientReducerActionTypes.RECIPE_INGREDIENTS_LOAD }
          );

          const updItem: Recipe = {
            ...actionRecipe,
            subrecipes:       subRecipes,
            ingredientGroups: ingredients,
            customServings:   updServings,
          };
          return ReduxHelper.setItem(state, updItem);
        }
      case RecipeFormActionTypes.RECIPE_FORM_INIT:
         {
           const newState = _.cloneDeep(defaultState);

           newState.item  = action.data as Recipe;
           newState.pending = PendingState.INITIAL;
           return newState;
         }
      case RecipeFormActionTypes.RECIPE_FORM_UPDATE:
        {
          const newState = _.clone(state);

          const newItem  = _.clone(newState.item) ?? {} as Recipe;
          _.set(newItem, action.name, action.value);

          if (state.item?.ingredientGroups !== newItem.ingredientGroups && newItem.ingredientGroups) {
            const ingredients = ingredient(
              [],
              { ingredientGroups: newItem.ingredientGroups,
                formatQuantity:   fq.bind(this, newItem.servings ?? 1, newItem.servings ?? 1),
                store: RECIPE_INGREDIENTS_STORE,
                type:  RecipeIngredientReducerActionTypes.RECIPE_INGREDIENTS_LOAD }
            );
            newItem.ingredientGroups = ingredients;
          }

          newState.item   = newItem;
          ReduxHelper.doSetValidation(newState, action.validation, 'merge');

          return newState;
        }
      default: break;
    }
  }

  return ReduxHelper.caseItemDefaultReducer(state, action, defaultState) as RecipeFormState;
};

export default reducer;
