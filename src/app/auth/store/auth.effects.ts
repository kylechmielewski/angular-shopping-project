import { Actions, ofType, Effect } from '@ngrx/effects';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000); //x 1000 becase getTime() is in milliseconds, and expiresIn is in seconds
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  //map returns an observable
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};
const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occurred';
  if (!errorResponse.error || !errorResponse.error.error) {
    //of() returns a new observable
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid Email or Password.';
      break;
  }

  //of() returns a new observable
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

//Needs this so things can be injected INto this class, like Actions and HttpClient in constructor
@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAteFj_idy34V6J3vv7qVHPWj9dbNeCH_g',
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

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
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  //This is an effect that will not yield a dispatch action at the end
  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    //tap won't return an observable or an
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    //map returns something, can use tap() if didn't want to return anything
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'DUMMY' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        //this.user.next(loadedUser);
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false,
        });

        //Future date - current date
        //   const expirationDuration =
        //     new Date(userData._tokenExpirationDate).getTime() -
        //     new Date().getTime();
        //   this.autoLogout(expirationDuration);
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  //actions is an observable that gives you access to all dispatched actions
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
