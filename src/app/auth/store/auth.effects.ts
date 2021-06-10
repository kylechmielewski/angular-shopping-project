import { Actions, ofType, Effect } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

//Needs this so things can be injected INto this class, like Actions and HttpClient in constructor
@Injectable()
export class AuthEffects {
  //don't need to call subscribe. We have to dispatch a new Action once we're done with this code.
  //We don't have to call dispatch because whatever is returned here will be treated as an action
  @Effect()
  authLogin = this.actions$.pipe(
    //OfType defines a filter for which type of effects you want to continue in this observable pipe stream
    //This particular one means only continue if LOGIN_START was dispatched
    ofType(AuthActions.LOGIN_START), //, can add multiple using a comma)
    //switchMap allows us to make a new observable taking another observables data
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAteFj_idy34V6J3vv7qVHPWj9dbNeCH_g',
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
          //We must return a working observable, we have to return of()
        )
        .pipe(
          map((resData) => {
            //of() returns a new observable
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            ); //x 1000 becase getTime() is in milliseconds, and expiresIn is in seconds
            return of(
              new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              })
            );
          }),
          catchError((error) => {
            // ...
            //of() returns a new observable
            return of();
          })
        );
    })
  );

  //actions is an observable that gives you access to all dispatched actions
  constructor(private actions$: Actions, private http: HttpClient) {}
}
