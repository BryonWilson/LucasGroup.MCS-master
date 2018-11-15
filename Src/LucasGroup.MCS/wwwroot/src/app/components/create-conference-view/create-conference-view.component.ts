import {
  AfterViewInit,
  Component,
  Input, Output,
  OnInit,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';


import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { start } from 'repl';


import { ImportJobsModalComponent } from '../../components/import-jobs-modal/import-jobs-modal.component';
import { ImportCandidatesModalComponent } from '../../components/import-candidates-modal/import-candidates-modal.component';
import { JobDetailModalComponent } from '../job-detail-modal/job-detail-modal.component';
import {
  LoginService,
  BullhornApiService,
  ConferenceService
} from '../../services';
import { AppUser, Conference } from '../../models';

@Component({
  selector: 'app-create-conference-view',
  templateUrl: './create-conference-view.component.html',
  styleUrls: ['./create-conference-view.component.scss']
})
export class CreateConferenceViewComponent implements OnInit, AfterViewInit {
  @Input() startDate = new FormControl(new Date().toISOString());
  @Input() endDate = new FormControl(this.startDate.value);
  @Input() currentConferenceInfo: Conference;
  conferenceName: string;
  minDate = new Date();
  @Output() jobTearSheetId: EventEmitter<any> = new EventEmitter();
  @Output() candidateSheetId: EventEmitter<any> = new EventEmitter();
  @Output() currentCandidateData: EventEmitter<any> = new EventEmitter();
  @Output() currentJobData: EventEmitter<any> = new EventEmitter();
  defaultStartTime = '08:00';
  defaultSessionInterval = '30';
  jobDisplayedColumns = ['JobId', 'JobTitle', 'Details'];
  candidateDisplayedColumns = ['PeopleId', 'FirstName', 'LastName'];
  jobDataSource = new MatTableDataSource(jobsTableData);
  candidateDataSource = new MatTableDataSource(candidateTableData);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) myTable: MatTable<any>;
  user: any;
  tearsheetList = [];
  selectedJobTearsheetId: Number;
  selectedCandidateTearsheetId: Number;
  jobDetailId: any;
  branchId: any;
  conferenceId: any;
  startDateSubscription: Subscription;
  endDateSubscription: Subscription;
  defaultStartTimeSubscription: Subscription;
  defaultSessionIntervalSubscription: Subscription;
  conferenceNameSubscription: Subscription;
  startMatchingButtonDisabled: boolean;

  constructor(
    public dialog: MatDialog,
    private _loginService: LoginService,
    private _bullHornApi: BullhornApiService,
    public snackBar: MatSnackBar,
    public _conferenceService: ConferenceService,
    private activeRoute: ActivatedRoute
  ) {
    this.startDateSubscription = _conferenceService.startDate$.subscribe(
      startDate => {
        this.startDate = new FormControl(startDate);
      }
    );
    this.endDateSubscription = _conferenceService.endDate$.subscribe(
      endDate => {
        this.endDate = new FormControl(endDate);
      }
    );
    this.defaultStartTimeSubscription = _conferenceService.defaultStartTime$.subscribe(
      defaultStartTime => {
        this.defaultStartTime = defaultStartTime;
      }
    );
    this.defaultSessionIntervalSubscription = _conferenceService.defaultSessionInterval$.subscribe(
      defaultSessionInterval => {
        this.defaultSessionInterval = defaultSessionInterval.toString();
      }
    );
    this.conferenceNameSubscription = _conferenceService.conferenceName$.subscribe(
      conferenceName => {
        this.conferenceName = conferenceName;
      }
    );
  }

  ngOnInit() {
    this.getCurrentUser();
    this.getConferenceId();
    this.getCurrentConference();
  }

  ngAfterViewInit() {
    this.getTearSheets();
    this.jobDataSource.sort = this.sort;
  }

  getCurrentUser() {
    this.user = this._loginService.getCurrentUser();
    this.branchId = this.user.branchId;
  }

  getTearSheets() {
    this._bullHornApi
      .getTearsheets(this.user.bullhornUserId)
      .subscribe(result => {
        this.tearsheetList = result;
      });
  }

  getConferenceId() {
    this.conferenceId =
      this.activeRoute.snapshot.params.conferenceId ||
      this._conferenceService.getConfId();
  }

  getCurrentConference() {
    const branchId = JSON.parse(localStorage.getItem('currentUser')).branchId;
    if (this.conferenceId) {
      this._conferenceService
        .getConference(branchId, this.conferenceId)
        .subscribe(result => {
          this.currentConferenceInfo = result;
          this.jobDataSource.data = result.jobOrders;
          this.candidateDataSource.data = result.candidates;
          this.myTable.renderRows();

          this.currentCandidateData.emit(result.candidates);
          this.currentJobData.emit(result.jobOrders);
        });
    }
  }

  updateStartDate(startDate) {
    this._conferenceService.updateStartDate(startDate.value);
  }
  updateEndDate(endDate) {
    this._conferenceService.updateEndDate(endDate.value);
  }
  updateDefaultStartTime(defaultStartTime) {
    this._conferenceService.updateDefaultStartTime(defaultStartTime);
  }
  updateDefaultSessionInterval(defaultSessionInterval) {
    this._conferenceService.updateDefaultSessionInterval(
      defaultSessionInterval
    );
  }

  updateConference() {
    this.updateDefaultStartTime(this.defaultStartTime);
    this.updateDefaultSessionInterval(this.defaultSessionInterval);
    this.getConferenceId();

    const confDetails = {
      name: this.conferenceName,
      startTime: moment(this.startDate.value).format('YYYY-MM-DDThh:mm:ss'),
      endTime: moment(this.endDate.value).format('YYYY-MM-DDThh:mm:ss'),
      branchId: this.branchId,
      defaultStart: this.defaultStartTime,
      defaultDuration: this.defaultSessionInterval
    };

    if (this.conferenceId) {
      this.updateExisitingConference(this.conferenceId, confDetails);
    } else {
      this.submitNewConference(confDetails);
    }
  }

  submitNewConference(confDetails) {
    this._conferenceService
      .saveConference(this.branchId, confDetails)
      .subscribe(data => {
        console.log(data);
        if (data) {
          this._conferenceService.setNewConferenceId(data.id);
          this.openSnackBar('Saved!', '');
        }
      });
  }

  updateExisitingConference(confId, confDetails) {
    this._conferenceService
      .updateConference(confId, confDetails)
      .subscribe(data => {
        console.log('UPDATE DATA:', data);
        if (data) {
          this.openSnackBar('Updated!', '');
        }
      });
  }

  onKeyUpConferenceName(event: KeyboardEvent) {
    this.conferenceName = (<HTMLInputElement>event.target).value;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  openJobsImportModal() {
    this.getConferenceId();
    const dialogRef = this.dialog.open(ImportJobsModalComponent, {
      height: '350px',
      width: '50vw',
      data: {
        list: this.tearsheetList,
        user: this.user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobTearSheetId.emit(result.jobTearsheetId);
        this._bullHornApi.getJobs(result.jobTearsheetId).subscribe(data => {
          this.postJobsToDatabase(data);
          this.jobDataSource.data = data;
        });
        this.myTable.renderRows();
      }
    });
  }

  postJobsToDatabase(array: any) {
    if (this.conferenceId) {
      array.forEach(item => {
        this._conferenceService
          .postJobsToDatabase(this.conferenceId, item)
          .subscribe(result => {
            console.log('POST RESULT:', result);
          });
      });
    }
  }

  openCandidatesImportModal() {
    this.getConferenceId();
    const dialogRef = this.dialog.open(ImportCandidatesModalComponent, {
      height: '350px',
      width: '50vw',
      data: {
        list: this.tearsheetList,
        user: this.user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.candidateSheetId.emit(result.candidateTearsheetId);
        this._bullHornApi
          .getCandidates(result.candidateTearsheetId)
          .subscribe(data => {
            this.candidateDataSource.data = data;
            this.postCandidatesToDatabase(data);
          });

        this.myTable.renderRows();
      }
    });
  }

  postCandidatesToDatabase(array: any) {
    if (this.conferenceId) {
      array.forEach(item => {
        this._conferenceService
          .postCandidatesToDatabase(this.conferenceId, item)
          .subscribe(result => {
            console.log('POST RESULT', result);
          });
      });
    }
  }

  checkIfFormComplete() {
    if (
      this.conferenceName &&
      (this.startDate && this.startDate.value) &&
      (this.endDate && this.endDate.value) &&
      this.defaultStartTime &&
      this.defaultSessionInterval
    ) {
      this.startMatchingButtonDisabled = false;
      this.updateConference();
    } else {
      this.startMatchingButtonDisabled = true;
    }
  }

  handleJobDetailClick(job) {
    const jobDetailModal = this.dialog.open(JobDetailModalComponent, {
      height: '90vh',
      width: '100vw',
      data: job.id
    });
  }
}

const candidateTableData = [];

const jobsTableData = [];
