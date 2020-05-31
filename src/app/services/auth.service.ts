import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../auth/user.module';
import { Router } from '@angular/router';

// why we creat this interface? it is reqiurment Response Body Payload, object with this fields
// see in below firts link
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;
  isLoggedIn = false;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  // we get below url from below link
  // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  // api key we found from our firebase project/ progject setting area

  // why we get secon argument suc as this argument? it is reqiurment Request Body Payload/ see in upper firts link

  // when we write http funqtion with return we subscribe in component, other vise here
  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyACfzXQ7ribEJLINHAvbAOCAemjs0colMM'
      ,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        catchError(this.handleError)
      ,
      // with tap operator we work with response data
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
      }))
  }

  login(email: string, password: string) {
    this.isLoggedIn = true;
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACfzXQ7ribEJLINHAvbAOCAemjs0colMM'
      ,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
      }))
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);

    // when we logout we must clean data from localstorage
    localStorage.removeItem('userData');

    // when we logout we must clear timer for auto token expiration
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.isLoggedIn = false;
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    // we emmit user
    this.user.next(user);

    // now we settimeout for autoLogout
    this.autoLogout(expiresIn * 1000);
    
    // we sent our user object to localstorage
    localStorage.setItem('userData', JSON.stringify(user));
    // this.isLoggedIn = true;    
  }

  // isLoggedIn(){
  //   return !!this.user.
  // }

  // this below code for not repating, this code need both login and signUp methods
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An anknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password does not correct';
        break;
    }
    return throwError(errorMessage);
  }

  // we call this method in app.component.ts file
  autoLogin(){
    // get and assign data from localstorage, with parse method convert string to object
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      return;
    }

    // this user object we take from localstorage and save here
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    
    // here we use getter, look to user.module.ts file
    if(loadedUser.token){
      this.user.next(loadedUser);
      this.isLoggedIn = true;
      
      // here we get how many time we have for outo logout
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.router.navigate(['/recipes']);
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number){

    console.log(`how many milliseconds we have to outologout: ${expirationDuration}`);
    

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();

    },expirationDuration);
  }
}

