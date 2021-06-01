import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutesModule } from './app-routes.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutesModule,
    SharedModule,
    CoreModule,
    StoreModule.forRoot({ shoppingList: shoppingListReducer }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
