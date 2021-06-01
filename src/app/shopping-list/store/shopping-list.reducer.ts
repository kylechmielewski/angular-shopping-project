import { Action } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

//Reducers are just functions
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.AddIngredient
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        //pulls properties from old state and puts it in new state
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    default:
      return state;
  }
}
