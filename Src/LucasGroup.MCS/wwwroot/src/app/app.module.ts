import { AuthGuardService } from './services/auth-guard.service';
import { AddJobViewComponent } from './components/add-job-view/add-job-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // replaces previous Http service
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { offlineProviders } from '@ngx-pwa/offline';

// import { CoreModule } from '@app/core';
// import { CoreModule } from './core';

import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './sharedModules/material-module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import * as comp from './components';

import * as svc from './services';
import { StoreModule } from '@ngrx/store';
// import { CoreModule, reducers, metaReducers } from './core';
// import { reducers, metaReducers } from './store';
// import { selectionDataReducer } from './store/selection-table.reducer';
import { reducers, metaReducers } from './store/selection-table.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { SelectionDataEffects } from './store/selection-table.effects';

export const compList = [
  comp.AddJobViewComponent,
  comp.AccessDeniedComponent,
  comp.AdminViewComponent,
  comp.CalendarViewComponent,
  comp.ConferenceCardComponent,
  comp.ConferenceViewComponent,
  comp.ForgotPasswordViewComponent,
  comp.LoginViewComponent,
  comp.PageNotFoundComponent,
  comp.ParticipantCardComponent,
  comp.RegisterViewComponent,
  comp.SettingsViewComponent,
  comp.RegisterViewComponent,
  comp.CreateConferenceViewComponent,
  comp.MatchConferenceViewComponent,
  comp.ScheduleConferenceViewComponent,
  comp.PrintAndSaveConferenceViewComponent,
  comp.ImportJobsModalComponent,
  comp.ImportCandidatesModalComponent,
  comp.PostToBullhornModalComponent,
  comp.JobDetailModalComponent,
  comp.UserDetailsViewComponent
];

@NgModule({
  declarations: [AppComponent, ...compList],
  entryComponents: [
    comp.ImportJobsModalComponent,
    comp.ImportCandidatesModalComponent,
    comp.PostToBullhornModalComponent,
    comp.JobDetailModalComponent,
    comp.UserDetailsViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    // CoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([SelectionDataEffects])
  ],
  providers: [
    svc.AuthGuardService,
    svc.RoleGuardService,
    svc.LoginService,
    svc.ConferenceService,
    svc.BullhornApiService,
    svc.ResolverService,
    svc.ConfigService,
    svc.AccountService,
    svc.LocalStorageService
    // environment.production ? offlineProviders({guardsRedirect: false}) : null
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
