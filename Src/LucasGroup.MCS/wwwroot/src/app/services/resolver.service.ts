import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { LoginService} from './login.service';

@Injectable()
export class ResolverService implements Resolve<any> {

  constructor(private router: Router,
              private routes: ActivatedRoute,
              private _loginService: LoginService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentRoute = route['_routerState'].url.split('/')[1];
    // TODO: enable locally cached credentials and validate last known token
    return this._loginService.isLoggedIn();
  }


}
