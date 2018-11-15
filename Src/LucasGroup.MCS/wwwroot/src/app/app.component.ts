import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select, State } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Network } from '@ngx-pwa/offline';

import { AppState, SelectionDataState } from './store/selectionTable.model';
import { selectSelectionDataState } from './store/selection-table.selectors';
// import { selectState } from './core/core.state';
// import { SelectionDataState } from './store/selectionTable.model';
// import { AppState, selectState } from './core/core.state';
// import {
//   SelectionDataState,
//   selectSelectionDataState,
//   AppState
// } from './core';

import { LoginService } from './services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  isLoggedIn = false;
  isOnline: Observable<boolean>;
  // protected network: Network | null
  private unsubscribe$: Subject<void> = new Subject<void>();
  // unsubscribe$: Subject<void> = new Subject<void>();
  selectionState: SelectionDataState;

  constructor(
    private _router: Router,
    private store: Store<AppState>,
    private _loginService: LoginService
  ) {
      // this.isOnline = Observable.of(true); // this.network ? this.network.onlineChanges :
      this.isOnline = of(true); // this.network ? this.network.onlineChanges :
      this._loginService.authNavStatus$.subscribe(() => {
      this.isLoggedIn = this._loginService.isLoggedIn();
    });
  }

  ngOnInit() {
    // this.isOnline = Observable.of(true); // this.network ? this.network.onlineChanges :
    // this._loginService.authNavStatus$.subscribe(() => {
    //   this.isLoggedIn = this._loginService.isLoggedIn();
    // });
    // this.subscribeToSelectionDataState();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

logout() {
    this._loginService.logout();
    this._router.navigate(['/login']);
  }

  getOnlineStatus() {
    const classes = {
      status: true,
      online: this.isOnline,
      offline: !this.isOnline
    };
    return classes;
  }

  isAdmin(): boolean {
    return this._loginService.isUserAdmin;
  }

  // private subscribeToSelectionDataState() {
  //   this.store
  //     .pipe(select(selectSelectionDataState), takeUntil(this.unsubscribe$))
  //     // .subscribe(auth => (this.isAuthenticated = auth.isAuthenticated));
  //     .subscribe(state => (this.selectionState = state));
  // }

}
