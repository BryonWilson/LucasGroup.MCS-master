// import { ClientContact } from './../../models/bullhorn';
// import { Candidate } from './../../models/conference';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  // SimpleChange,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  Subject,
  Subscription
} from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import {
  MatDialog,
  // MatDialogRef,
  // MAT_DIALOG_DATA,
  MatSnackBar,
  MatSort,
  MatTable,
  // MatTableDataSource
} from '@angular/material';
import * as moment from 'moment';
// import { SelectionModel } from '@angular/cdk/collections';
import { Store, select } from '@ngrx/store';
import { v4 as uuid } from 'uuid';
import { PostToBullhornModalComponent } from '../post-to-bullhorn-modal/post-to-bullhorn-modal.component';
import { BullhornApiService, ConferenceService, ConfigService } from '../../services';
// import { Job } from '../../models/bullhorn';
import { LoginService } from '../../services/login.service';
import { SelectionTableData, SelectionDataState } from '../../store/selectionTable.model';
import { SelectionTableDatasource } from '../../store/selection-table.datasource';
import * as fromActions from '../../store/selection-table.actions';
// import { element } from 'protractor';
import {
  UpdateSelectionData,
  RemoveSelectionData,
  // PersistSelectionDataElements,
  // ClearSelectionDataElements,
  SelectSelectionData
} from '../../store/selection-table.actions';
import {
  // selectState,
  selectSelectionDataState,
  selectionDataCount,
  selectAllSelectionData,
  selectCurrentSelectionData,
  selectSelectionDataIds,
  selectSelectedTotal
} from '../../store/selection-table.selectors';
// import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-match-conference-view',
  templateUrl: './match-conference-view.component.html',
  styleUrls: ['./match-conference-view.component.scss']
})

export class MatchConferenceViewComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() candidateTearsheetId: number;
  @Input() jobTearsheetId: number;
  @Input() startDate = new FormControl(new Date());
  @Input() endDate = new FormControl(new Date());
  @Input() currentCandidateData: any;
  @Input() currentJobData: any;
  defaultStartTime: any;
  defaultSessionInterval: string;
  postToBullhornData: any;
  displayedColumns = ['Job', 'Client', 'Candidate', 'Select'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) matTable: MatTable<any>;
  selectedRowClientIndex: any;
  selectedClient: any;
  selectedRowJobIndex: any;
  selectedJob: any;
  selectedRowCandidateIndex: any;
  selectedCandidate: any;
  user: any;
  startDateSubscription: Subscription;
  endDateSubscription: Subscription;
  defaultStartTimeSubscription: Subscription;
  defaultSessionIntervalSubscription: Subscription;
  postToBullhornDataSubscription: Subscription;
  clients = [];
  jobs = [];
  candidates = [];
  persistence: boolean;
  isAllDataSelected: boolean;
  selectionState: SelectionDataState;
  allSelectionData$: Observable<SelectionTableData[]>;
  selectionDataById$: Observable<SelectionTableData>;
  selectionDataCnt$: Observable<number>;
  selectionDataIds$: Observable<string[] | number[]>;
  selectedTotal$: Observable<number>;
  allSelectionData: SelectionTableData[];
  selectedTotal: number;
  dataSource: SelectionTableDatasource;

  // These are only being used for their lengths
  listOfSelectedCandidates = [];
  listOfSelectedJobs = [];

  static createSelectionTableData(): SelectionTableData {
    return {
      id: uuid(),
      job: null,
      client: null,
      candidate: null,
      userId: null,
      conferenceId: null,
      jobOrderId: null,
      candidateId: null,
      duration: null,
      interviewerFirstName: null,
      interviewerLastName: null,
      clientId: null,
      clientContactId: null,
      dateBegin: null,
      dateEnd: null,
      selected: null
    };
  }

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public _bullhornApi: BullhornApiService,
    public _loginService: LoginService,
    public _conferenceService: ConferenceService,
    public _configService: ConfigService,
    public store: Store<SelectionDataState>
  ) {
      // // Initialize Selection Data from Local Storage
      // this.persistence = _configService.getPersistence();
      // if (this.persistence) { this.store.dispatch(new fromActions.LoadSelectionDataElements()); }

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
      this.postToBullhornDataSubscription = _conferenceService.postToBullhornData$.subscribe(
        postToBullhornData => {
          this.postToBullhornData = postToBullhornData;
        }
      );
    }

  ngOnInit() {
    this.user = this._loginService.getCurrentUser();
    this.persistence = this._configService.getPersistence();

    // this.store
    //   .pipe(select(selectSelectionDataState), takeUntil(this.unsubscribe$))
    //   .subscribe(state => (this.selectionState = state));

    this.store.dispatch(new fromActions.LoadSelectionDataElements());

    this.store
      .pipe(select(selectSelectionDataState), takeUntil(this.unsubscribe$))
      .subscribe(state => (this.selectionState = state));

    this.allSelectionData$ = this.store.pipe(select(selectAllSelectionData));
    this.selectionDataCnt$ = this.store.select(selectionDataCount);
    this.allSelectionData$ = this.store.select(selectAllSelectionData);
    this.selectionDataIds$ = this.store.select(selectSelectionDataIds);
    this.selectionDataById$ = this.store.select(selectCurrentSelectionData);
    this.selectedTotal$ = this.store.select(selectSelectedTotal);

    // this.store
    // .pipe(select(selectAllSelectionData), takeUntil(this.unsubscribe$))
    // .subscribe(data => {
    //   this.selectionData = data;
    //   this.store.dispatch(new fromActions.PersistSelectionDataElements({ selectionData: data }));
    //   // if (!this.persistence) {
    //   //   this.store.dispatch(new fromActions.PersistSelectionDataElements({ selectionData: data }));
    //   // } else {
    //   //   this.store.dispatch(new fromActions.PersistSelectionDataElements({ selectionData: this.selectionData }));
    //   // }
    // });

    // this.allSelectionData$ = this.store.pipe(select(selectAllSelectionData));
    // this.allSelectionData$
    //   .subscribe(data => {
    //       this.selectionData = data as SelectionTableData[];
    //   });

    // this.store
    //   .pipe(select(selectAllSelectionData), takeUntil(this.unsubscribe$))
    //   .subscribe(data => (this.selectionData = data));

    // this.store
    //   .pipe(select(selectAllSelectionData))
    //   .subscribe(data => {
    //     this.selectionData = data;
    //     // this.store.dispatch(new fromActions.PersistSelectionDataElements({ selectionData: data }));
    // });

    // this.store
    //   .pipe(select(selectAllSelectionData))
    //   .subscribe(data => {
    //     this.selectionData = data;
    //     this.store.dispatch(new fromActions.PersistSelectionDataElements({ selectionData: data }));
    // });

    // this.store
    //   .pipe(select(selectAllSelectionData), takeUntil(this.unsubscribe$))
    //   .subscribe(data => (this.selectionData = data));

    // this.store
    //   .pipe(select(selectSelectionDataState), takeUntil(this.unsubscribe$))
    //   .subscribe(state => (this.selectionState = state));

    this.store
      .pipe(select(selectAllSelectionData), takeUntil(this.unsubscribe$))
      .subscribe(value => (this.allSelectionData = value));

    this.store
      .pipe(select(selectSelectedTotal), takeUntil(this.unsubscribe$))
      .subscribe(value => (this.selectedTotal = value));

    // this.store
    //   .pipe(select(selectAllSelectionData), takeUntil(this.unsubscribe$))
    //   .subscribe(data => {
    //     this.allSelectionData = data;
    //     this.store.dispatch(new fromActions.PersistSelectionDataElements({ selectionData: data }));
    // });

    this.dataSource = new SelectionTableDatasource(this.allSelectionData$);
  }

  ngAfterViewInit() {
    let matchObject = {};
    if (this.allSelectionData.length > 0) {
      this.allSelectionData.forEach(entity => {
        matchObject = {
          candidateId: entity.candidateId,
          ownerId: entity.userId,
          conferenceId: entity.conferenceId,
          timeSlot: entity.dateBegin,
          duration: entity.duration,
          interviewerFirstName: entity.interviewerFirstName,
          interviewerLastName: entity.interviewerLastName
        };
        this.postMatch(entity.jobOrderId.toString(), matchObject);
      });
      this.updatePostToBullhornData(this.allSelectionData$);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.candidateTearsheetId &&
      changes.candidateTearsheetId.currentValue
    ) {
      this._bullhornApi
        .getCandidates(changes.candidateTearsheetId.currentValue)
        .subscribe(data => {
          this.candidates = data;
        });
    } else if (
      changes.currentCandidateData &&
      changes.currentCandidateData.currentValue
    ) {
      this.candidates = changes.currentCandidateData.currentValue;
    }

    if (changes.jobTearsheetId && changes.jobTearsheetId.currentValue) {
      this._bullhornApi
        .getJobs(changes.jobTearsheetId.currentValue)
        .subscribe(data => {
          this.jobs = data;
          data.forEach(item => {
            this._bullhornApi.getJobDetails(item.id).subscribe(jobDetail => {
              this.clients.push({
                ...jobDetail.clientCorporation,
                clientContact: jobDetail.clientContact
              });
            });
          });
        });
    } else if (changes.currentJobData && changes.currentJobData.currentValue) {
      this.jobs = changes.currentJobData.currentValue;
      this.jobs.forEach(item => {
        this._bullhornApi
          .getJobDetails(parseInt(item.bullhornJobOrderId, 10))
          .subscribe(jobDetail => {
            if (jobDetail) {
              this.clients.push({
                ...jobDetail.clientCorporation,
                clientContact: jobDetail.clientContact
              });
            }
          });
      });
    }
  }

  ngOnDestroy() {
    // Clear Selection Data from Local Storage
    // this.store.dispatch(new ClearSelectionDataElements());
    if (!this.persistence) { this.store.dispatch(new fromActions.ClearSelectionDataElements()); }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  grabValuefromIndex(array: any[], index: any): String {
    return array[index];
  }

  setClickedRowClient(index) {
    this.selectedRowClientIndex = index;
    this.selectedClient = this.grabValuefromIndex(this.clients, index);
    console.log('SELECETED CLIENT:', this.selectedClient);
  }
  setClickedRowCandidate(index) {
    this.selectedRowCandidateIndex = index;
    this.selectedCandidate = this.grabValuefromIndex(this.candidates, index);
    console.log('SELECETED CANDIDATE:', this.selectedCandidate);
  }

  setClickedRowJob(index) {
    this.selectedRowJobIndex = index;
    this.selectedJob = this.grabValuefromIndex(this.jobs, index);
    console.log('SELECETED JOB:', this.selectedJob);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selectionData.filter(ele => ele.selected === true).length;
    // const numRows = this.selectionData.length;
    // return numSelected === numRows;
    this.selectedTotal = this.allSelectionData.filter(ele => ele.selected === true).length;
    let retVal = false;
    // const numRows = this.allSelectionData.length;
    // retVal = (numRows === this.selectedTotal);
    if (this.selectionState && this.selectedTotal) {
      const numRows = this.selectionState.ids.length;
      retVal = (numRows === this.selectedTotal);
    }
    return retVal;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllDataSelected = this.isAllSelected();
    this.allSelectionData.forEach(ele => {
      this.store.dispatch(new UpdateSelectionData({ selectionData: {
            id: ele.id, changes: {
              selected: !this.isAllDataSelected
            }
          }
        })
      );
    });
    const selectionDataUpdates = Object.values(this.selectionState.entities).map(
          selectionData => Object.assign({}, {
            id: selectionData.id,
            changes: {
              selected: !this.isAllDataSelected
            }
          })
    );
    this.store.dispatch(new fromActions.UpdateSelectionDataElements({ selectionData: selectionDataUpdates }));
  }

  /** Toggles Selected Switch on Selected row. */
  onToggleSelectedData(selectedElement: SelectionTableData) {
    const selectionTableData = selectedElement;
    this.store.dispatch(new UpdateSelectionData({ selectionData: {
            id: selectionTableData.id, changes: {
            selected: !selectionTableData.selected
          }
        }
      })
    );
  }

  async updateConference() {
    this.openSnackBar('Saved!', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  updateStartDate(startDate) {
    this._conferenceService.updateStartDate(startDate);
  }
  updateEndDate(endDate) {
    this._conferenceService.updateEndDate(endDate);
  }
  updateDefaultStartTime(defaultStartTime) {
    this._conferenceService.updateDefaultStartTime(defaultStartTime);
  }
  updateDefaultSessionInterval(defaultSessionInterval) {
    this._conferenceService.updateDefaultSessionInterval(
      defaultSessionInterval
    );
  }
  updatePostToBullhornData(postToBullhornData) {
    this._conferenceService.updatePostToBullhornData(postToBullhornData);
  }

  postMatch(jobId: string, matchObject) {
    this._conferenceService.postMatch(jobId, matchObject).subscribe(data => {
      console.log(data);
      if (data) {
        console.log('POST MATCH DATA:', data);
        this.openSnackBar('Saved!', '');
      }
    });
  }

  deleteMatch(jobId: string, matchObject) {
    this._conferenceService.deleteMatch(jobId, matchObject).subscribe(data => {
      console.log(data);
      if (data) {
        console.log('DELETE MATCH DATA:', data);
        this.openSnackBar('Saved!', '');
      }
    });
  }

  addSelectionData(selectionData: SelectionTableData) {
    this.store.dispatch(new SelectSelectionData({ id: null }));
    this.store.dispatch( new fromActions.AddSelectionData({ selectionData }));
  }

  updateSelectionData(selectionData: SelectionTableData) {
    this.store.dispatch(new fromActions.UpdateSelectionData(
      { selectionData: {id: selectionData.id, changes: selectionData }}
    ));
  }

  deleteSelectionData(id: string) {
    this.store.dispatch( new RemoveSelectionData(
      { id }
    ));
  }

  handleAddCandidateClick() {
    let matchObject = {};
    console.log('selectedCandidate', this.selectedCandidate);
    console.log('selectedCandidate.candidate', this.selectedCandidate.candidate);
    const jobOrderId = Number.parseInt(this.selectedJob.bullhornJobOrderId, null);
    const currentDateTime = new Date;
    if (this.currentCandidateData && this.currentJobData) {
      this.addSelectionData({
        id: uuid(),
        job: this.selectedJob.title,
        client: this.selectedClient,
        candidate: `${this.selectedCandidate.candidate.lastName}, ${
          this.selectedCandidate.candidate.firstName
        }`,
        userId: this.user.bullhornUserId,
        conferenceId: this.selectedCandidate.conferenceId,
        // jobOrderId: this.selectedJob.id,
        jobOrderId: jobOrderId,
        // candidateId: this.selectedCandidate.candidate.id,
        candidateId: this.selectedCandidate.candidate.bullhornCandidateId,
        duration: this.selectedJob.durationWeeks || 0,
        interviewerFirstName: this.selectedClient.clientContact.firstName,
        interviewerLastName: this.selectedClient.clientContact.lastName,
        clientId: this.selectedClient.id,
        clientContactId: this.selectedClient.clientContact.id,
        // startTime: moment(this.startDate.value).format('YYYY-MM-DDThh:mm:ss'),
        // dateBegin: moment("10/15/2014 9:00", "M/D/YYYY H:mm").valueOf() //this.startDate,
        dateBegin: moment(
                          // moment(this.startDate.value)
                          moment(currentDateTime)
                          // .format('YYYY-MM-DDThh:mm:ss')
                          // .toLocaleString()
                          // ).valueOf(),
                          ).toDate(),
        dateEnd: moment(
                          // moment(this.startDate.value)
                          moment(currentDateTime)
                          .add(Number(this.defaultSessionInterval), 'minutes')
                          // .format('YYYY-MM-DDThh:mm:ss')
                          // .toLocaleString()
                          // ).valueOf(),
                        ).toDate(),
        selected: false
      });

      matchObject = {
        candidateId: this.selectedCandidate.candidate.bullhornCandidateId.toString(),
        ownerId: this.user.bullhornUserId.toString(),
        conferenceId: this.selectedCandidate.conferenceId.toString(),
        timeSlot: moment(
                          // moment(this.startDate.value)
                          moment(currentDateTime)
                          // .format('YYYY-MM-DDThh:mm:ss')
                          // .toLocaleString()
                          // ).valueOf(),
                        ).toDate(),
        duration: this.selectedJob.durationWeeks || 0,
        interviewerFirstName: this.selectedClient.clientContact.firstName,
        interviewerLastName: this.selectedClient.clientContact.lastName
      };

      console.log('MATCH OBJ', matchObject);
      this.postMatch(this.selectedJob.bullhornJobOrderId, matchObject);
    } else {
      this.addSelectionData({
        id: uuid(),
        job: this.selectedJob.title,
        client: this.selectedClient,
        candidate: `${this.selectedCandidate.lastName}, ${
          this.selectedCandidate.firstName
        }`,
        userId: this.user.bullhornUserId,
        conferenceId: this.selectedCandidate.conferenceId,
        jobOrderId: this.selectedJob.id,
        candidateId: this.selectedCandidate.id,
        duration: this.selectedJob.durationWeeks || 0,
        interviewerFirstName: this.selectedClient.clientContact.firstName,
        interviewerLastName: this.selectedClient.clientContact.lastName,
        clientId: this.selectedClient.id,
        clientContactId: this.selectedClient.clientContact.id,
        dateBegin: moment(
                          // moment(this.startDate.value)
                          moment(currentDateTime)
                          // .format('YYYY-MM-DDThh:mm:ss')
                          // .toLocaleString()
                          // ).valueOf(),
                          ).toDate(),
        dateEnd: moment(
                          // moment(this.startDate.value)
                          moment(currentDateTime)
                          .add(Number(this.defaultSessionInterval), 'minutes')
                        //   .format('YYYY-MM-DDThh:mm:ss')
                        //   .toLocaleString()
                        // ).valueOf(),
                        ).toDate(),
        selected: false
      });

      matchObject = {
        candidateId: this.selectedCandidate.id,
        ownerId: this.user.bullhornUserId,
        conferenceId: this.selectedCandidate.conferenceId,
        timeSlot: moment(
                          // moment(this.startDate.value)
                          moment(currentDateTime)
                          // .format('YYYY-MM-DDThh:mm:ss')
                          // .toLocaleString()
                          // ).valueOf(),
                        ).toDate(),
        duration: this.selectedJob.durationWeeks || 20,
        interviewerFirstName: 'Bryan',
        interviewerLastName: 'Hadaway'
      };
      this.postMatch(this.selectedJob.id, matchObject);
    }

    if (
      this.listOfSelectedCandidates.every(i => i !== this.selectedCandidate)
    ) {
      this.listOfSelectedCandidates.push(this.selectedCandidate);
    }

    if (this.listOfSelectedJobs.every(i => i !== this.selectedJob)) {
      this.listOfSelectedJobs.push(this.selectedJob);
    }

    // console.log('SELECT TABLE:', this.selectionData);
    console.log('SELECT TABLE:', this.selectionState.entities);
    this.updatePostToBullhornData(this.allSelectionData$);
  }

  handleRemoveCandidateClick() {
    let matchObject = {};
    const currentDateTime = new Date;

    this.allSelectionData$.subscribe(entities => {
      entities.forEach(entity => {
        if (entity.selected) {
          console.log('selectData: ' + entity);
          matchObject = {
            candidateId: entity.candidateId.toString(),
            ownerId: entity.userId.toString(),
            conferenceId: entity.conferenceId.toString(),
            timeSlot: moment(
                              // moment(this.startDate.value)
                              moment(currentDateTime)
                              // .format('YYYY-MM-DDThh:mm:ss')
                              // .toLocaleString()
                              // ).valueOf(),
                            ).toDate(),
            duration: entity.duration || 0,
            interviewerFirstName: entity.interviewerFirstName,
            interviewerLastName: entity.interviewerLastName
            // clientId: this.selectedClient.id,
            // clientContactId: this.selectedClient.clientContact.id,
            // dateBegin: moment(
            //                   // moment(this.startDate.value)
            //                   moment(currentDateTime)
            //                   .format('YYYY-MM-DDThh:mm:ss')
            //                   .toLocaleString()
            //                 ).valueOf(),
            // dateEnd: moment(
            //                   // moment(this.startDate.value)
            //                   moment(currentDateTime)
            //                   .add(Number(this.defaultSessionInterval), 'minutes')
            //                   .format('YYYY-MM-DDThh:mm:ss')
            //                   .toLocaleString()
            //                 ).valueOf()
          };

          console.log('MATCH OBJ', matchObject);
          // this.deleteMatch(this.selectedJob.bullhornJobOrderId, matchObject);
          this.deleteMatch(entity.jobOrderId.toString(), matchObject);
          this.deleteSelectionData(entity.id);
          // console.log('SelectionData Count :' + this.selectionData.length);
          console.log('SelectionData Count :' + this.selectionState.ids.length);
        }
      });
    });

    if (this.listOfSelectedCandidates.every(i => i !== this.selectedCandidate)) {
      this.listOfSelectedCandidates.push(this.selectedCandidate);
    }

    if (this.listOfSelectedJobs.every(i => i !== this.selectedJob)) {
      this.listOfSelectedJobs.push(this.selectedJob);
    }

    // console.log('SELECT TABLE:', this.selectionData);
    console.log('SELECT TABLE:', this.selectionState.entities);
    this.updatePostToBullhornData(this.allSelectionData$);
  }

  openDialog() {
    const dialogRef = this.dialog.open(PostToBullhornModalComponent, {
      height: '750px',
      width: '900px',
      data: { allSelectionData$: this.allSelectionData$ }
    });
  }
}
