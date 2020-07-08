import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Output } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('quantityInput', { static: false }) quantityInput: ElementRef;
  @Output() ingredientAddedFired = new EventEmitter<Ingredient>();


  constructor(private titleCasePipe: TitleCasePipe) { }

  ngOnInit(): void {
  }

  onAddItem() {
    const newIngName = this.titleCasePipe.transform(this.nameInput.nativeElement.value);
    const newIngredient = new Ingredient(newIngName, this.quantityInput.nativeElement.value);
    this.ingredientAddedFired.emit(newIngredient);
  }

}
