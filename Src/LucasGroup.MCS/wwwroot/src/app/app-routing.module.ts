import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as comp from './components';

import { AuthGuardService, RoleGuardService } from './services';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: comp.LoginViewComponent
      },
      {
        path: 'forgot',
        component: comp.ForgotPasswordViewComponent
      },
      {
        path: 'forgot/:token',
        component: comp.ForgotPasswordViewComponent
      },
      {
        path: 'register',
        component: comp.RegisterViewComponent,
        canActivate: [AuthGuardService, RoleGuardService]
      },
      {
        path: 'home',
        component: comp.CalendarViewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'conference',
        component: comp.ConferenceViewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'conference/:conferenceId',
        component: comp.ConferenceViewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'settings',
        component: comp.SettingsViewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'userDetails',
        component: comp.UserDetailsViewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin',
        component: comp.AdminViewComponent,
        canActivate: [AuthGuardService, RoleGuardService]
      },
      {
        path: 'pageNotFound',
        component: comp.PageNotFoundComponent
      },
      {
        path: 'accessDenied',
        component: comp.AccessDeniedComponent
      },
      {
        path: '**',
        component: comp.PageNotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
