import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { TitleCasePipe } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
import { setClassMetadata } from '@angular/core/src/r3_symbols';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formElement') formElement: NgForm;
  editingSubscription: Subscription;
  editMode = false;
  editingItemIndex: number;
  editingItem: Ingredient;

  constructor(
    private titleCasePipe: TitleCasePipe,
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit(): void {
    this.editingSubscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editingItem = stateData.editedIngredient;
          this.formElement.setValue({
            name: this.editingItem.name,
            quantity: this.editingItem.quantity,
          });
        } else {
          this.editMode = false;
        }
      });

    // this.editingSubscription =
    //   this.shoppingListService.startedEditing.subscribe((index: number) => {
    //     this.editMode = true;
    //     this.editingItemIndex = index;
    //     this.editingItem = this.shoppingListService.getIngredient(index);
    //     this.formElement.setValue({
    //       name: this.editingItem.name,
    //       quantity: this.editingItem.quantity,
    //     });
    //   });
  }

  onSubmit(form: NgForm) {
    //name & quantity come from name="" field in .html
    const value = form.value;
    const newIngredientName = this.titleCasePipe.transform(value.name);
    const newIngredient = new Ingredient(newIngredientName, value.quantity);
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(
      //   this.editingItemIndex,
      //   newIngredient
      // );
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      //this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.formElement.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    //this.shoppingListService.deleteIngredient(this.editingItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.editingSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
