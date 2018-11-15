import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  _apiURI: string;
  _persistence: string;
  _delay: number;
  _retry: number;

  constructor() {
    // TODO: Replace with configurable environment variable
    this._apiURI = '/api';
    this._persistence = 'true';
    this._delay = 3000; // 2000;
    this._retry = 5; // 2;
    }

    getApiURI() {
        return this._apiURI;
    }

    getPersistence() {
        return (this._persistence === 'true');
    }

    getDelay() {
      return this._delay;
  }

    getRetry() {
        return this._retry;
    }

}
