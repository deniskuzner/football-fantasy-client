import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../constants/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor(private http: HttpClient) { }

  calculateByDate(searchRequest: {fromDate, toDate}) {
    return this.http.post(AppConstants.serverUrl + '/performances/calculate/date', searchRequest);
  }

  calculateByGameweek(gameweekId: number) {
    return this.http.get(AppConstants.serverUrl + '/performances/calculate/gameweek/' + gameweekId);
  }

}
