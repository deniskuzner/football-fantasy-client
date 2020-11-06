import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppConstants } from '../constants/app-constants';

import { Gameweek } from '../models/gameweek.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FixturesService {

  fixturesUpdated = new Subject<any>();

  constructor(private http: HttpClient) { }

  parseSeasonFixtures() {
    return this.http.get<Gameweek[]>(AppConstants.serverUrl + '/gameweeks/parse-season-gameweeks');
  }

  getAll() {
    return this.http.get<Gameweek[]>(AppConstants.serverUrl + '/gameweeks/all');
  }

  getByOrderNumber(orderNumber: number) {
    return this.http.get<Gameweek>(AppConstants.serverUrl + "/gameweeks/gameweek/order-number/" + orderNumber);
  }

  count() {
    return this.http.get<number>(AppConstants.serverUrl + "/gameweeks/count");
  }

  getCurrentGameweek() {
    return this.http.get<Gameweek>(AppConstants.serverUrl + "/gameweeks/current");
  }

  getCurrentGameweekNumber() {
    return this.http.get<number>(AppConstants.serverUrl + "/gameweeks/current/order-number");
  }

}
