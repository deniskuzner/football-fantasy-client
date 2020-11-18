import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConstants } from '../constants/app-constants';
import { Player } from '../models/player.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  playerAdded = new Subject<Player>();
  playerRemoved = new Subject<Player>();
  playerSwitched = new Subject<Player>();
  playerChanged = new Subject<Player>();
  teamReset = new Subject<any>();

  constructor(private http: HttpClient) { }

  save(team: Team) {
    return this.http.post<Team>(AppConstants.serverUrl + '/teams/team', team);
  }

  getTeamById(id: number) {
    return this.http.get<Team>(AppConstants.serverUrl + '/teams/team/' + id);
  }

}
