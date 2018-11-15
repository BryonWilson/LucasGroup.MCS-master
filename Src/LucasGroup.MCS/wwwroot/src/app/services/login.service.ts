import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import {
  ICredentials,
  IRegistration,
  Registration,
  AuthResponse,
  AppUser,
  ResetEmail,
  ResetPassword,
  EmailResponse
} from '../models';

import { Observable ,  BehaviorSubject } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';

@Injectable()
export class LoginService extends BaseService {
  private currentUser: AppUser = null;
  loggedIn = false;
  baseUrl = '';

  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private _http: HttpClient,
    private _configService: ConfigService
  ) {
    super();
    this.loggedIn = !!localStorage.getItem('auth_token');
    this.baseUrl = _configService.getApiURI();
    // ?? not sure if this the best way to broadcast the status but seems to resolve issue on page refresh where auth status is lost in
    // header component resulting in authed user nav links disappearing despite the fact user is still logged in
    // this._authNavStatusSource.next(this.loggedIn);
  }

  register(reg: Registration): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(this.baseUrl + '/auth/register', reg, this.options)
      .pipe(
        tap(
          data => {
            this.currentUser = data.user;
            console.log(this.currentUser);
            // localStorage.setItem('auth_token', data.token.accessToken);
            // localStorage.setItem(
            //   'currentUser',
            //   JSON.stringify(this.currentUser)
            // );
            this._authNavStatusSource.next(true);
          },
          error => console.log(error)
        ),
        catchError(this.handleErrorOne)
      );
  }

  login(userName: string, password: string): Observable<AuthResponse> {
    const user = JSON.stringify({ email: userName, password: password });
    return this._http
      .post<AuthResponse>(this.baseUrl + '/auth/login', user, this.options)
      .pipe(
        delay(1000),
        tap(data => {
          this.currentUser = data.user;
          this.loggedIn = true;
          localStorage.removeItem('currentUser');
          localStorage.setItem('auth_token', data.token.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          this._authNavStatusSource.next(true);
        }),
        catchError(this.handleErrorOne)
      );
  }

  forgotPassword(email: string): Observable<EmailResponse> {
    return this._http
      .post<EmailResponse>(
        this.baseUrl + '/auth/resetEmail',
        { email: email },
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  resetPassword(resetPassword: ResetPassword): Observable<boolean> {
    return this._http
      .post<boolean>(
        this.baseUrl + '/auth/resetPassword',
        resetPassword,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getCurrentUser() {
    return this.currentUser || this.retrieveUser();
  }

  get isUserAdmin(): boolean {
    return this.getCurrentUser().roles.includes('Admin');
  }

  private retrieveUser() {
    if (localStorage.getItem('currentUser')) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    return this.currentUser;
  }
}
