import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    //this.userSubscription = this.authService.user
    this.userSubscription = this.store
      .select('auth')
      //only need this pipe in store implementation
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !user ? false : true;
      });
  }

  onSaveData() {
    //this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    //this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    //this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
