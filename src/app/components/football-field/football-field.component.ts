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
  goalkeeper: Player;
  defenders: Player[] = new Array(4);
  midfielders: Player[] = new Array(4);
  forwards: Player[] = new Array(2);
  bench: Player[] = new Array(4);

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
  }

  populateField() {
    if(!this.team) {
      return;
    }
    this.team.teamPlayers.forEach(tp => {
      this.addPlayer(tp.player);
    });
  }

  onTeamPlayersChanged(teamPlayers: TeamPlayer[]) {
    this.removeAll();
    teamPlayers.forEach(tp => {
      this.addPlayer(tp.player);
    });
  }

  addPlayer(player: Player) {
    let position = player.position;
    if (position == "GK") {
      this.addGK(player);
    }
    if (position == "DF") {
      this.addDF(player);
    }
    if (position == "MF") {
      this.addMF(player);
    }
    if (position == "FW") {
      this.addFW(player);
    }
  }

  addGK(player: Player) {
    if (!this.goalkeeper) {
      this.goalkeeper = player;
    } else {
      this.bench[0] = player;
    }
  }

  addDF(player: Player) {
    for (let i = 0; i < this.defenders.length; i++) {
      if (!this.defenders[i]) {
        this.defenders[i] = player;
        return;
      }
    }
    this.bench[1] = player;
  }

  addMF(player: Player) {
    for (let i = 0; i < this.midfielders.length; i++) {
      if (!this.midfielders[i]) {
        this.midfielders[i] = player;
        return;
      }
    }
    this.bench[2] = player;
  }

  addFW(player: Player) {
    for (let i = 0; i < this.forwards.length; i++) {
      if (!this.forwards[i]) {
        this.forwards[i] = player;
        return;
      }
    }
    this.bench[3] = player;
  }

  removePlayer(player: Player) {
    let position = player.position;
    if (position == "GK") {
      this.removeGK(player);
    }
    if (position == "DF") {
      this.removeDF(player);
    }
    if (position == "MF") {
      this.removeMF(player);
    }
    if (position == "FW") {
      this.removeFW(player);
    }
  }

  removeGK(player: Player) {
    if(!this.goalkeeper) {
      this.bench[0] = null;
    } else if(this.goalkeeper.id == player.id){
      this.goalkeeper = null;
    } else {
      this.bench[0] = null;
    }
  }

  removeDF(player: Player) {
    let indexOf = this.defenders.indexOf(player);
    if (indexOf > -1) {
      this.defenders[indexOf] = null;
    } else {
      this.bench[1] = null;
    }
  }

  removeMF(player: Player) {
    let indexOf = this.midfielders.indexOf(player);
    if (indexOf > -1) {
      this.midfielders[indexOf] = null;
    } else {
      this.bench[2] = null;
    }
  }

  removeFW(player: Player) {
    let indexOf = this.forwards.indexOf(player);
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
      // DODATI LOGIKU ZA RESET KAD SE URADI SWITCH DA BI MOGLO DA SE PROVERI
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
