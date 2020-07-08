import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)];

  constructor() { }

  ngOnInit(): void {
  }

  OnIngredientAdded(ingredient: Ingredient) {

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
