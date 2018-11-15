import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConferenceService } from '../../services';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-conference-view',
  templateUrl: './conference-view.component.html',
  styleUrls: ['./conference-view.component.scss'],
  providers: [ConferenceService]
})
export class ConferenceViewComponent implements OnInit, OnDestroy {
  conferenceId: string;
  subscription: Subscription;
  branchId: number;
  conferenceData;
  defaultStartTime = new FormControl(new Date());
  defaultSessionInterval = new FormControl(new Date());
  conferenceName: string;
  candidateTearsheetId: Number;
  jobTearsheetId: Number;
  currentCandidateData: any;
  currentJobData: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private _conferenceService: ConferenceService
  ) {
    this.branchId = JSON.parse(localStorage.getItem('currentUser')).branchId;
    // console.log(this.branchId);

    this.subscription = this.activeRoute.paramMap.subscribe(params => {
      if (params.get('conferenceId') !== this.conferenceId) {
        this.conferenceId = params.get('conferenceId');
        if (this.conferenceId) {
          this.loadExistingConferenceData(
            this.branchId,
            parseInt(this.conferenceId, 10)
          );
        }
      }
    });
  }

  ngOnInit() {}
  loadExistingConferenceData(branchId, conferenceId) {
    this._conferenceService
      .getConference(branchId, conferenceId)
      .subscribe(result => {
        this.conferenceData = result;
        this._conferenceService.updateStartDate(result.startDateTime);
        this._conferenceService.updateEndDate(result.endDateTime);
        this._conferenceService.updateDefaultStartTime(result.defaultStartTime);
        this._conferenceService.updateDefaultSessionInterval(
          result.defaultDurationMinutes
        );
        this._conferenceService.updateConferenceName(result.name);
        this.defaultStartTime = result.defaultStartTime;
        this.defaultSessionInterval = result.defaultDurationMinutes;
        this.conferenceName = result.name;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
