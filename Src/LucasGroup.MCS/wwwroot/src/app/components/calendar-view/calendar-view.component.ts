import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConferenceCardComponent } from '../../components/index';

import {
  ConferenceService,
  BullhornApiService,
  LoginService
} from '../../services';
import { Conference, TearSheet } from '../../models';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  errors = '';
  includePastConferences = false;
  conferences: Conference[] = [];
  tearsheets: TearSheet[];

  constructor(
    private _router: Router,
    private _conferenceService: ConferenceService,
    private _bullhornApiService: BullhornApiService,
    private _loginService: LoginService
  ) {}

  ngOnInit() {
    this.getConferencesForBranch();
  }

  getConferencesForBranch() {
    const branchId = this._loginService.getCurrentUser().branchId;
    this._conferenceService
      .getConferences(branchId, this.includePastConferences)
      .subscribe(
        result => {
          if (result) {
            this.conferences = result;
            this.calculateConferenceMetrics(this.conferences);
          }
        },
        error => {
          this.errors = error;
        }
      );
  }

  private calculateConferenceMetrics(conferences: Conference[]) {
    conferences.forEach(c => {
      const uniqClients = c.jobOrders.reduce(
        (acc, j) => ({ ...acc, [j.client.id]: true }),
        {}
      );
      c.numClients = Object.keys(uniqClients).length;
    });
  }

  setValue(e) {
    this.includePastConferences = e.checked;
    this.getConferencesForBranch();
  }
}
