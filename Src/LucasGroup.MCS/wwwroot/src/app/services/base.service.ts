import {throwError as observableThrowError,  Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorObserver } from 'rxjs';


export abstract class BaseService {

  constructor() { }

  protected handleErrorOne(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return new ErrorObservable(
    //   'Something bad happened; please try again later.');
    // return Observable.throw(
    //   'Something bad happened; please try again later.');
    return observableThrowError(
      'Something bad happened; please try again later.');
  }

  protected handleError(error: any) {
    let applicationError = error.headers.get('Application-Error');

    // either applicationError in header or model error in body
    if (applicationError) {
      return observableThrowError(applicationError);
    }

    let modelStateErrors = '';
    let serverError = error.json();

    if (!serverError.type) {
      for (let key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return observableThrowError(modelStateErrors || 'Server error');
  }

  // Consolidated console logging
  protected consoleLog(message: String, detail: any) {
    if (!environment.production) {

      console.log(message, detail);
    }
  }

}
