import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { User, UserSettings, Role } from '../models';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AccountService extends BaseService {
  baseUrl = '';
  options = { headers: new HttpHeaders() };

  constructor(
    private _http: HttpClient,
    private _configService: ConfigService
  ) {
    super();
    this.baseUrl = _configService.getApiURI();
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('auth_token')
      })
    };
  }

  getUsers(): Observable<User[]> {
    return this._http
      .get<User[]>(this.baseUrl + '/account/users', this.options)
      .pipe(catchError(this.handleErrorOne));
  }

  getUserSettings(userEmail?: any): Observable<UserSettings> {
    const queryString = userEmail ? `/account/settings?userEmail=${userEmail}` : '/account/settings';
    return this._http
      .get<UserSettings>(this.baseUrl + queryString, this.options)
      .pipe(catchError(this.handleErrorOne));
  }

  saveUserSettings(settings: UserSettings, userEmail?: any): Observable<UserSettings> {
    const queryString = userEmail ? `/account/settings?userEmail=${userEmail}` : '/account/settings';
    return this._http
      .put<UserSettings>(
        this.baseUrl + queryString,
        settings,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  getRoles(): Observable<Role[]> {
    return this._http
      .get<Role[]>(this.baseUrl + '/auth/roles', this.options)
      .pipe(catchError(this.handleErrorOne));
  }

  getBranches(): Observable<any[]> {
    // return this._http.
    //   get(`${this.baseUrl}/account/branches`, this.options)
    //   .pipe(catchError(this.handleErrorOne));
    return this._http.
      get<any[]>(`${this.baseUrl}/account/branches`, this.options)
      .pipe(catchError(this.handleErrorOne));
  }
}
