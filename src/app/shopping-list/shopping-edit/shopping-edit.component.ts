import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { TitleCasePipe } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('quantityInput', { static: false }) quantityInput: ElementRef;


  constructor(private titleCasePipe: TitleCasePipe,
    private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
  }

  onAddItem() {
    const newIngredientName = this.titleCasePipe.transform(this.nameInput.nativeElement.value);
    const newIngredient = new Ingredient(newIngredientName, this.quantityInput.nativeElement.value);
    this.shoppingListService.addIngredient(newIngredient)
  }

}
