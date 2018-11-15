import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams
} from '@angular/common/http';

import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { JobCandidate, TearSheet, Job } from '../models';

import { Observable, throwError } from 'rxjs';
import { catchError, concat, delay, retry, tap, map } from 'rxjs/operators';
import { JobSubmissionParams,
  SendOutObject,
  AppointmentObject
} from '../models/bullhorn';
import { error } from '@angular/compiler/src/util';

@Injectable()
export class BullhornApiService extends BaseService {
  baseUrl = '';
  options: { headers: HttpHeaders; params: HttpParams };
  delay: number;
  retry: number;
  resp: Observable<any>;

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
    this.delay = _configService.getDelay();
    this.retry = _configService.getRetry();
  }

  getTearsheets(ownerId: number): Observable<TearSheet[]> {
    return this._http
      .get<TearSheet[]>(
        this.baseUrl + '/bullhorn/tearsheets/' + ownerId,
        this.options
      )
      .pipe(retry(this.retry), catchError(this.handleErrorOne));
  }

  getCandidates(tearsheetId: number): Observable<JobCandidate[]> {
    return this._http
      .get<JobCandidate[]>(
        this.baseUrl + '/bullhorn/candidates/' + tearsheetId,
        this.options
      )
      .pipe(retry(this.retry), catchError(this.handleErrorOne));
  }

  getJobs(tearsheetId: number): Observable<Job[]> {
    return this._http
      .get<Job[]>(this.baseUrl + '/bullhorn/jobs/' + tearsheetId, this.options)
      .pipe(retry(this.retry), catchError(this.handleErrorOne));
  }

  // Submit Internal Submission
  submitInternalSubmission(
                            jobOrderId: number,
                            candidateId: number,
                            userId: number
                          ): Observable<any> {

    this.resp = this._http.put<any>(
      `${
        this.baseUrl
      }/bullhorn/job/${jobOrderId}/submitInternalSubmission?candidateId=${candidateId}&userId=${userId}`,
      null,
      this.options
    )
    .pipe(retry(this.retry),
      catchError(err => {
        if (err.status !== 200) {
          console.error('Internal Submission Failure:', err.message);
          this.handleErrorOne(err);
        }
        return throwError(err);
      }),
    );

    // Return Successful Response
    return this.resp;
  }

  // Submit Client Submission
  submitClientSubmission(jobOrderId: number, sendOutObject: SendOutObject): Observable<SendOutObject[]> {
    this.resp = this._http.put<SendOutObject[]>(
      `${
        this.baseUrl
      }/bullhorn/job/${jobOrderId}/submitClientSubmission`,
      sendOutObject,
      this.options
    )

    .pipe(retry(this.retry),
      catchError(err => {
        if (err.status !== 200) {
          console.error('Client Submission Failure:', err.message);
          this.handleErrorOne(err);
        }
        return throwError(err);
      }),
    );

    // Return Successful Response
    return this.resp;
  }

  // Submit Interview
  submitInterview(
                  jobOrderId: number,
                  candidateId: number,
                  userId: number
                ): Observable<any> {

    this.resp = this._http.put<any>(
      `${
        this.baseUrl
      }/bullhorn/job/${jobOrderId}/submitInterview?candidateId=${candidateId}&userId=${userId}`,
      null,
      this.options
    )
    .pipe(retry(this.retry),
      catchError(err => {
        if (err.status !== 200) {
          console.error('Interview Submission Failure:', err.message);
          this.handleErrorOne(err);
        }
        return throwError(err);
      }),
    );

    // Return Successful Response
    return this.resp;
  }

  // Submit Appointment
  submitAppointment(jobOrderId: number, appointmentObject: AppointmentObject): Observable<any> {

    this.resp = this._http
      .put<AppointmentObject[]>(
      `${
        this.baseUrl
      }/bullhorn/job/${jobOrderId}/submitAppointment`,
      appointmentObject,
      this.options
    )
    .pipe(retry(this.retry),
      catchError(err => {
        if (err.status !== 200) {
          console.error('Appointment Submission Failure:', err.message);
          this.handleErrorOne(err);
        }
        return throwError(err);
      }),
    );

    // Return Successful Response
    return this.resp;
  }

  submitCandidates(jobSubmissionParams: JobSubmissionParams): Observable<any> {
    const jobOrderId = jobSubmissionParams.jobOrderId;
    const candidateId = jobSubmissionParams.candidateId;
    const clientId = jobSubmissionParams.clientId;
    const clientContactId = jobSubmissionParams.clientContactId;
    const dateBegin = jobSubmissionParams.dateBegin;
    const dateEnd = jobSubmissionParams.dateEnd;
    const userId = jobSubmissionParams.userId;
    const jobName = jobSubmissionParams.jobName;

    const sendOutObject: SendOutObject = {
                                            jobOrderId: jobOrderId,
                                            candidateId: candidateId,
                                            clientId: clientId,
                                            clientContactId: clientContactId,
                                            userId: userId
                                          };

    const appointmentObject: AppointmentObject = {
                                                    jobOrderId: jobOrderId,
                                                    candidateId: candidateId,
                                                    clientContactId: clientContactId,
                                                    dateBegin: dateBegin,
                                                    dateEnd: dateEnd,
                                                    ownerId: clientContactId,
                                                    jobName: jobName
                                                  };

    const internalSubmissionStream = this.submitInternalSubmission(
            jobOrderId,
            candidateId,
            userId
          );

    const clientSubmissionStream = this.submitClientSubmission(
            jobOrderId,
            sendOutObject
          ).pipe(
            delay(this.delay)
          );

    const interviewStream = this.submitInterview(
            jobOrderId,
            candidateId,
            userId
          ).pipe(
            delay(this.delay)
          );

    const appointmentStream = this.submitAppointment(
            jobOrderId,
            appointmentObject
          ).pipe(
            delay(this.delay)
          );

    return internalSubmissionStream
          .pipe(
            concat(clientSubmissionStream)
          ).pipe(
    // return clientSubmissionStream
    //       .pipe(
            concat(interviewStream)
          ).pipe(
    // return interviewStream
    //       .pipe(
            concat(appointmentStream)
          ).pipe(
    // return appointmentStream
    //       .pipe(
            map(res => {
              return res;
            })
          );
  }

  getJobDetails(jobOrderId: number): Observable<Job> {
    return this._http
      .get<Job>(this.baseUrl + '/bullhorn/job/' + jobOrderId, this.options)
      .pipe(retry(this.retry), catchError(this.handleErrorOne));
  }
}
