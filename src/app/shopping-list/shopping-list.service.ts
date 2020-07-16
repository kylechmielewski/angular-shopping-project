import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)];
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  constructor() { }


  getIngredient(index: number) {
    return this.ingredients[index];
  }

  getIngredients() {
    //will return a (not deep)copy of the array so we're not returning original
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.normalizeAndAddIngredient(ingredient);
    //this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    for (let ingredient of ingredients) {
      this.normalizeAndAddIngredient(ingredient);
    }
    //...splits array of objects into a list of individual objects
    //this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }


  //Internally make ingredient names TitleCase, and add them correctly
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
