import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeamLeagueMembership } from '../models/team-league-membership.model';
import { AppConstants } from '../constants/app-constants';
import { League } from '../models/league.model';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private http: HttpClient) { }

  join(tlm: TeamLeagueMembership) {
    return this.http.post<League>(AppConstants.serverUrl + '/team-league-memberships/tlm', tlm);
  }

  create(league: League) {
    return this.http.post<League>(AppConstants.serverUrl + '/leagues/league', league);
  }

  findByTeamId(teamId: number) {
    return this.http.get<League[]>(AppConstants.serverUrl + '/leagues/team/' + teamId);
  }

}
