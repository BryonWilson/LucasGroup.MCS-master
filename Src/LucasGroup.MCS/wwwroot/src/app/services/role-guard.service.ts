import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from './login.service';

@Injectable()
export class RoleGuardService {

  constructor(private _loginService: LoginService,
              private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this._loginService.isUserAdmin) {
      return true;
    } else {
      this._router.navigate(['home']);
      return false;
    }
    // NOTE : This should be done with an async function that confirms the role for auth token,
    // but this is the quick, dirty and unsecure way for now
  }

}
