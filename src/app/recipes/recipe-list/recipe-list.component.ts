import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeChangedSub: Subscription;

  constructor(private recipeService: RecipeService,
    private router: Router,
  private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    //Read from recipe service to grab any new recipes that were added
    //to the list from the new recipe button
    this.recipeChangedSub = this.recipeService.recipesChanged
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.activatedRouter });
  }

  ngOnDestroy() {
    this.recipeChangedSub.unsubscribe();
  }
}
