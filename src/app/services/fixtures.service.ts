import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppConstants } from '../constants/app-constants';

import { Gameweek } from '../models/gameweek.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FixturesService {

  fixturesUpdated = new Subject<Gameweek[]>();

  constructor(private http: HttpClient) { }

  parseSeasonFixtures() {
    return this.http.get<Gameweek[]>(AppConstants.serverUrl + '/gameweeks/parse-season-gameweeks');
  }

  getAll() {
    return this.http.get<Gameweek[]>(AppConstants.serverUrl + '/gameweeks/all');
  }

}
