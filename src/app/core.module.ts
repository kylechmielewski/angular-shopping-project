import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TitleCasePipe } from '@angular/common';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { AuthInterceptor } from './auth/auth.interceptor';


@NgModule({
    //Do not need to export services to use them
    providers: [
        TitleCasePipe,
        ShoppingListService,
        RecipeService,
        {
          provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
        }]
})
export class CoreModule {}