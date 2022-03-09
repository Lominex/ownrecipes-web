import { handleError, request } from '../../common/CustomSuperagent';
import { serverURLs } from '../../common/config';
import { MiniBrowseDispatch, MINI_BROWSE_STORE } from './MiniBrowseTypes';
import { ACTION } from '../../common/store/ReduxHelper';
import { RecipeListDto, toRecipeList } from '../../recipe/store/RecipeTypes';

// eslint-disable-next-line import/prefer-default-export
export const loadMiniBrowse = (filter: string) => (dispatch: MiniBrowseDispatch) => {
  dispatch({ store: MINI_BROWSE_STORE, type: ACTION.GET_START });
  request()
    .get(`${serverURLs.mini_browse}${filter}`)
    .then(res => {
        dispatch({
          store: MINI_BROWSE_STORE,
          type:  ACTION.GET_SUCCESS,
          data:  res.body.results?.map((dto: RecipeListDto) => toRecipeList(dto)),
        });
    })
    .catch(err => dispatch(handleError(err, MINI_BROWSE_STORE)));
};
