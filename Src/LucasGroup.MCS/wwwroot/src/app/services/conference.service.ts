import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams
} from '@angular/common/http';

import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { Conference, Job } from '../models';

import { Observable ,  Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ConferenceService extends BaseService {
  baseUrl = '';
  options: { headers: HttpHeaders; params: HttpParams };
  newConfId: number;
  // Observable string sources
  private startDate = new Subject<any>();
  private endDate = new Subject<any>();
  private defaultStartTime = new Subject<any>();
  private defaultSessionInterval = new Subject<any>();
  private conferenceName = new Subject<any>();
  private postToBullhornData = new Subject<any>();

  // Observable string streams
  startDate$ = this.startDate.asObservable();
  endDate$ = this.endDate.asObservable();
  defaultStartTime$ = this.defaultStartTime.asObservable();
  defaultSessionInterval$ = this.defaultSessionInterval.asObservable();
  conferenceName$ = this.conferenceName.asObservable();
  postToBullhornData$ = this.postToBullhornData.asObservable();

  updateStartDate(startDate: any) {
    this.startDate.next(startDate);
  }
  updateEndDate(endDate: any) {
    this.endDate.next(endDate);
  }
  updateDefaultStartTime(defaultStartTime: any) {
    this.defaultStartTime.next(defaultStartTime);
  }
  updateDefaultSessionInterval(defaultSessionInterval: any) {
    this.defaultSessionInterval.next(defaultSessionInterval);
  }
  updateConferenceName(conferenceName: any) {
    this.conferenceName.next(conferenceName);
  }
  updatePostToBullhornData(postToBullhornData: any) {
    this.postToBullhornData.next(postToBullhornData);
  }

  constructor(
    private _http: HttpClient,
    private _configService: ConfigService
  ) {
    super();
    this.baseUrl = _configService.getApiURI();
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('auth_token')
      }),
      params: new HttpParams()
    };
  }

  getConferences(
    branchId: number,
    includePast: boolean
  ): Observable<Conference[]> {
    this.options.params = new HttpParams().set(
      'includePastConferences',
      includePast.toString()
    );
    // return this._http
    //   .get<Conference>(this.baseUrl + '/conferences/' + branchId, this.options)
    //   .pipe(catchError(this.handleErrorOne));
    return this._http
      .get<Conference[]>(this.baseUrl + '/conferences/' + branchId, this.options)
      .pipe(catchError(this.handleErrorOne));
  }

  getConference(
    branchId: number,
    conferenceId: number
  ): Observable<Conference> {
    return this._http
      .get<Conference>(
        this.baseUrl + '/conferences/' + branchId + '/' + conferenceId,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  updateConference(
    conferenceId: number,
    conference: Conference
  ): Observable<Conference[]> {
    // return this._http
    //   .put<Conference>(
    //     this.baseUrl + '/conferences/' + conferenceId,
    //     conference,
    //     this.options
    return this._http
      .put<Conference[]>(
        this.baseUrl + '/conferences/' + conferenceId,
        conference,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  saveConference(branchId: number, conference: any): Observable<Conference> {
    return this._http
      .post<Conference>(
        this.baseUrl + '/conferences/' + branchId,
        conference,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  postJobDetail(confId: number, jobDetail: Job): Observable<any> {
    return this._http
      .post<Job>(
        this.baseUrl + '/conferences/' + confId,
        jobDetail,
        this.options
      )
      .pipe(
        tap(data => {
          console.log(data);
        }),
        catchError(this.handleErrorOne)
      );
  }

  setNewConferenceId(confId: number) {
    this.newConfId = confId;
  }

  getConfId() {
    return this.newConfId;
  }

  postJobsToDatabase(confId: number, jobDetail: any): Observable<any> {
    return this._http
      .post<any>(
        this.baseUrl + '/conferences/' + confId + '/joborder',
        jobDetail,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  postCandidatesToDatabase(
    confId: number,
    candidateDetail: any
  ): Observable<any> {
    return this._http
      .post<any>(
        this.baseUrl + '/conferences/' + confId + '/candidate',
        candidateDetail,
        this.options
      )
      .pipe(catchError(this.handleErrorOne));
  }

  postMatch(jobId, matchObject): Observable<any> {
    return this._http
      .post(
        this.baseUrl + '/conferences/joborder/' + jobId + '/match',
        matchObject,
        this.options
      )
      .pipe(
        tap(data => {
          console.log(data);
        }),
        catchError(this.handleErrorOne)
      );
  }

  deleteMatch(jobId, matchObject): Observable<any> {
    return this._http
      .delete(
        this.baseUrl + '/conferences/joborder/' + jobId + '/match',
        this.options
      )
      .pipe(
        tap(data => {
          console.log(data);
        }),
        catchError(this.handleErrorOne)
      );
  }

  updateInterviewerName(
    jobOrderId: number,
    interviewer: Object
  ): Observable<any> {
    return this._http
      .put<any>(
        this.baseUrl + '/conferences/interviewer/' + jobOrderId,
        interviewer,
        this.options
      )
      .pipe(
        tap(result => {
          console.log('INTERVIEWER POST', result);
        }),
        catchError(this.handleErrorOne)
      );
  }
}
