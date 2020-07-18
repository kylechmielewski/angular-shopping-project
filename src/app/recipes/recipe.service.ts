import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  //private recipes: Recipe[] = [
  //  new Recipe('Tasty Schnitzel',
  //    'A super-tasty Schnitzel - just awesome!',
  //    'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //    [
  //      new Ingredient('Meat', 1),
  //      new Ingredient('French Fries', 20)
  //    ]),
  //  new Recipe('Big Fat Burger',
  //    `What's left to say?`,
  //    'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //    [
  //      new Ingredient('Buns', 1),
  //      new Ingredient('Meat', 1)
  //    ])
  //];
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    //will return a (not deep) copy of the array so we're not returning original
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);

    //emit that the recipe list changed and pass the new list as an event
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;

    //emit that the recipe list changed and pass the new list as an event
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);

    //emit that the recipe list changed and pass the new list as an event
    this.recipesChanged.next(this.recipes.slice());
  }
}
