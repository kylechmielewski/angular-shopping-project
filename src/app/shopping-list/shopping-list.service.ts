import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)];
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  constructor() { }

  getIngredients() {
    //will return a copy of the array so we're not returning original
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.normalizeAndAddIngredient(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    for (let ingredient of ingredients) {
      this.normalizeAndAddIngredient(ingredient);
    }
    //...splits array of objects into a list of individual objects
    //this.ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  normalizeAndAddIngredient(ingredient: Ingredient) {
    if (this.ingredients.some(i => i.name === ingredient.name)) {
      const idx = this.ingredients.findIndex(i => i.name === ingredient.name);
      if (idx >= 0) {
        this.ingredients[idx].quantity = +this.ingredients[idx].quantity + +ingredient.quantity;
      }
    } else {
      this.ingredients.push(ingredient);
    }
  }
}
