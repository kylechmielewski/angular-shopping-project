import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';



const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },  //only redirect if the full path is empty
  { 
    path: 'recipes', 
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) //For lazy loading
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) //For lazy loading
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) //For lazy loading
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //Once we are on home page, all other modules will be loaded while user browses page
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
    //RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutesModule { }
