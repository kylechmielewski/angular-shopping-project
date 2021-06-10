import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //This interceptor should add the auth token to all outgoing requests
    //return this.authService.user.pipe(
    return this.store.select('auth').pipe(
      take(1),
      //map only needed for store implementation
      map((authState) => {
        return authState.user;
      }),
      //Use exhaustMap to replace the user result from take(1) with this new return
      exhaustMap((user) => {
        if (!user) {
          return next.handle(request);
        }
        const modifiedRequest = request.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
