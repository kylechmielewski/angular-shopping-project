import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
}

const initialState = {
  user: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );

      //first copy the old state, then overwrite what we want to overwrite.
      return { ...state, user: user };
    case AuthActions.LOGOUT:
      //first copy the old state, then overwrite what we want to overwrite.
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
