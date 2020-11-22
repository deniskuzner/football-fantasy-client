import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-football-field',
  templateUrl: './football-field.component.html',
  styleUrls: ['./football-field.component.css']
})
export class FootballFieldComponent implements OnInit, OnDestroy {

  @Input() mode: String;
  @Input() team: Team;
  goalkeeper: TeamPlayer;
  defenders: TeamPlayer[] = new Array(4);
  midfielders: TeamPlayer[] = new Array(4);
  forwards: TeamPlayer[] = new Array(2);
  bench: TeamPlayer[] = new Array(4);

  playerAddedSub: Subscription;
  playerRemovedSub: Subscription;
  teamResetSub: Subscription;
  teamPlayersChangedSub: Subscription;

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.populateField();
    this.playerAddedSub = this.teamService.playerAdded.subscribe(
      res => {
        this.addPlayer(res);
      }
    );
    this.playerRemovedSub = this.teamService.playerRemoved.subscribe(
      res => {
        this.removePlayer(res);
      }
    );
    this.teamResetSub = this.teamService.teamReset.subscribe(
      () => {
        this.reset();
      }
    );
    this.teamPlayersChangedSub = this.teamService.teamPlayersChanged.subscribe(
      res => {
        this.onTeamPlayersChanged(res);
      }
    );
  }

  ngOnDestroy() {
    this.playerAddedSub.unsubscribe();
    this.playerRemovedSub.unsubscribe();
    this.teamResetSub.unsubscribe();
    this.teamPlayersChangedSub.unsubscribe();
  }

  populateField() {
    if(!this.team) {
      return;
    }
    let teamPlayers = [...this.team.teamPlayers];
    teamPlayers.forEach(tp => {
      this.addPlayer(tp);
    });
  }

  onTeamPlayersChanged(teamPlayers: TeamPlayer[]) {
    this.removeAll();
    teamPlayers.forEach(tp => {
      this.addPlayer(tp);
    });
  }

  addPlayer(teamPlayer: TeamPlayer) {
    let position = teamPlayer.player.position;
    if (position == "GK") {
      this.addGK(teamPlayer);
    }
    if (position == "DF") {
      this.addDF(teamPlayer);
    }
    if (position == "MF") {
      this.addMF(teamPlayer);
    }
    if (position == "FW") {
      this.addFW(teamPlayer);
    }
  }

  addGK(teamPlayer: TeamPlayer) {
    if (!this.goalkeeper) {
      this.goalkeeper = teamPlayer;
    } else {
      this.bench[0] = teamPlayer;
    }
  }

  addDF(teamPlayer: TeamPlayer) {
    for (let i = 0; i < this.defenders.length; i++) {
      if (!this.defenders[i]) {
        this.defenders[i] = teamPlayer;
        return;
      }
    }
    this.bench[1] = teamPlayer;
  }

  addMF(teamPlayer: TeamPlayer) {
    for (let i = 0; i < this.midfielders.length; i++) {
      if (!this.midfielders[i]) {
        this.midfielders[i] = teamPlayer;
        return;
      }
    }
    this.bench[2] = teamPlayer;
  }

  addFW(teamPlayer: TeamPlayer) {
    for (let i = 0; i < this.forwards.length; i++) {
      if (!this.forwards[i]) {
        this.forwards[i] = teamPlayer;
        return;
      }
    }
    this.bench[3] = teamPlayer;
  }

  removePlayer(teamPlayer: TeamPlayer) {
    let position = teamPlayer.player.position;
    if (position == "GK") {
      this.removeGK(teamPlayer);
    }
    if (position == "DF") {
      this.removeDF(teamPlayer);
    }
    if (position == "MF") {
      this.removeMF(teamPlayer);
    }
    if (position == "FW") {
      this.removeFW(teamPlayer);
    }
  }

  removeGK(teamPlayer: TeamPlayer) {
    if(!this.goalkeeper) {
      this.bench[0] = null;
    } else if(this.goalkeeper.player.id == teamPlayer.player.id){
      this.goalkeeper = null;
    } else {
      this.bench[0] = null;
    }
  }

  removeDF(teamPlayer: TeamPlayer) {
    let indexOf = this.defenders.indexOf(teamPlayer);
    if (indexOf > -1) {
      this.defenders[indexOf] = null;
    } else {
      this.bench[1] = null;
    }
  }

  removeMF(teamPlayer: TeamPlayer) {
    let indexOf = this.midfielders.indexOf(teamPlayer);
    if (indexOf > -1) {
      this.midfielders[indexOf] = null;
    } else {
      this.bench[2] = null;
    }
  }

  removeFW(teamPlayer: TeamPlayer) {
    let indexOf = this.forwards.indexOf(teamPlayer);
    if(indexOf > -1) {
      this.forwards[indexOf] = null;
    } else {
      this.bench[3] = null;
    }
  }

  reset() {
    if(this.mode == FootballFieldMode.TEAM_SELECTION) {
      this.removeAll();
    } else if (this.mode == FootballFieldMode.PICK_TEAM || this.mode == FootballFieldMode.TRANSFERS) {
      this.removeAll();
      this.populateField();
    }
  }

  removeAll() {
    this.goalkeeper = null;
    for (let i = 0; i < this.defenders.length; i++) {
      this.defenders[i] = null;
    }
    for (let i = 0; i < this.midfielders.length; i++) {
      this.midfielders[i] = null;
    }
    for (let i = 0; i < this.forwards.length; i++) {
      this.forwards[i] = null;
    }
    for (let i = 0; i < this.bench.length; i++) {
      this.bench[i] = null;
    }
  }

}
