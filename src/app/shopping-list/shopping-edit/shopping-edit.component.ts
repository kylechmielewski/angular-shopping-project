import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { TitleCasePipe } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formElement') formElement: NgForm;
  editingSubscription: Subscription;
  editMode = false;
  editingItemIndex: number;
  editingItem: Ingredient;
  

  constructor(private titleCasePipe: TitleCasePipe,
    private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.editingSubscription = this.shoppingListService.startedEditing
      .subscribe((index: number) => {
        this.editMode = true;
        this.editingItemIndex = index;
        this.editingItem = this.shoppingListService.getIngredient(index);
        this.formElement.setValue({
          name: this.editingItem.name,
          quantity: this.editingItem.quantity
        })
      });
  }

  onSubmit(form: NgForm) {
    //name & quantity come from name="" field in .html
    const value = form.value;
    const newIngredientName = this.titleCasePipe.transform(value.name);
    const newIngredient = new Ingredient(newIngredientName, value.quantity);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editingItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.formElement.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editingItemIndex);
    this.onClear();
  }


  ngOnDestroy() {
    this.editingSubscription.unsubscribe();
  }

}
