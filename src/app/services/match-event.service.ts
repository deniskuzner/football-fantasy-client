import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConstants } from '../constants/app-constants';
import { MatchEvent } from '../models/match-event.model';

@Injectable({
  providedIn: 'root'
})
export class MatchEventService {

  constructor(private http: HttpClient) { }

  parseGameweekMatchEvents(gameweekId: number) {
    return this.http.get<MatchEvent[]>(AppConstants.serverUrl + '/match-events/parse-match-events/gameweek/' + gameweekId);
  }

  parseMatchEvents(url: string) {
    return this.http.post<MatchEvent[]>(AppConstants.serverUrl + '/match-events/parse-match-events/match', url);
  }

}
