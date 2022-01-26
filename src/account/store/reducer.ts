import ReduxHelper from '../../common/store/ReduxHelper';
import { AccountAction, AccountActionTypes, AccountState, ACCOUNT_STORE, ACCOUNT_TOKEN_STORAGE_KEY } from './types';

const defaultState: AccountState = ReduxHelper.getItemReducerDefaultState(ACCOUNT_STORE);

const reducer = (state = defaultState, action: AccountAction): AccountState => {
  switch (action.type) {
    case AccountActionTypes.LOGIN:
      {
        const user = JSON.stringify(action.user);
        localStorage.setItem(ACCOUNT_TOKEN_STORAGE_KEY, user);
        return ReduxHelper.setItem(state, action.user);
      }
    case AccountActionTypes.LOGOUT:
      localStorage.removeItem(ACCOUNT_TOKEN_STORAGE_KEY);
      return defaultState;
    default:
      return ReduxHelper.caseDefaultReducer(state, action, defaultState);
  }
};

export default reducer;
