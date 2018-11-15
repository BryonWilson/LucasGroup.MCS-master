
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from './login.service';
import { ConferenceService } from './conference.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _conferenceService: ConferenceService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this._loginService.isLoggedIn()) {
      this._conferenceService.getConferences(this._loginService.getCurrentUser().branchId, true);
      return true; }

    this._router.navigate(['/login']);
    return false;
  }

}
