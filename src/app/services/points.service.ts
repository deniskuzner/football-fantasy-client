import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../constants/app-constants';
import { PlayerGameweekPerformance } from '../models/player-gameweek-performance.model';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor(private http: HttpClient) { }

  calculateByDate(searchRequest: {fromDate, toDate}) {
    return this.http.post<PlayerGameweekPerformance[]>(AppConstants.serverUrl + '/performances/calculate/date', searchRequest);
  }

  calculateByGameweek(gameweekId: number) {
    return this.http.get<PlayerGameweekPerformance[]>(AppConstants.serverUrl + '/performances/calculate/gameweek/' + gameweekId);
  }

}
