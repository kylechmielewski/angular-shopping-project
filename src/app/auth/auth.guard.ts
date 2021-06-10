import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  //, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //return this.authService.user.pipe(
    return this.store.select('auth').pipe(
      take(1),
      //only need this map for store implementation
      map((authState) => {
        return authState.user;
      }),
      map((user) => {
        const isAuth = !user ? false : true;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
  //canActivateChild(
  //  next: ActivatedRouteSnapshot,
  //  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //  return true;
  //}
  //canDeactivate(
  //  component: unknown,
  //  currentRoute: ActivatedRouteSnapshot,
  //  currentState: RouterStateSnapshot,
  //  nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //  return true;
  //}
  //canLoad(
  //  route: Route,
  //  segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //  return true;
  //}
}
