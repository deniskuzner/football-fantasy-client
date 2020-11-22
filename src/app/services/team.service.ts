import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConstants } from '../constants/app-constants';
import { TeamPlayer } from '../models/team-player.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  playerAdded = new Subject<TeamPlayer>();
  playerRemoved = new Subject<TeamPlayer>();
  playerSwitched = new Subject<TeamPlayer>();
  playerChanged = new Subject<TeamPlayer>();
  teamReset = new Subject<any>();
  teamPlayersChanged = new Subject<TeamPlayer[]>();
  captainChanged = new Subject<{teamPlayer: TeamPlayer, type: String}>();

  constructor(private http: HttpClient) { }

  save(team: Team) {
    return this.http.post<Team>(AppConstants.serverUrl + '/teams/team', team);
  }

  getTeamById(id: number) {
    return this.http.get<Team>(AppConstants.serverUrl + '/teams/team/' + id);
  }

}
