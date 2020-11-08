import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { TeamService } from 'src/app/services/team.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnInit, OnDestroy {

  players: Player[] = [];
  footballFieldMode: FootballFieldMode = FootballFieldMode.TEAM_SELECTION;

  goalkeeper: Player;
  defenders: Player[] = [];
  midfielders: Player[] = [];
  forwards: Player[] = [];
  bench: Player[] = [];

  playerRemovedSub: Subscription;

  constructor(
    private teamService: TeamService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.playerRemovedSub = this.teamService.playerRemoved.subscribe(
      res => {
        this.removePlayer(res);
      }
    );
  }

  ngOnDestroy() {
    this.playerRemovedSub.unsubscribe();
  }

  onPlayerAdded(player: Player) {
    if (this.isDuplicate(player)) {
      this.openSnackBar(player.name + " is already in your squad!");
      return;
    }

    //DODATI PROVERU ZA CENU I LIMIT IGRACA PO KLUBU

    let position = player.position;
    let added = false;
    if (position == "GK") {
      added = this.addGK(player);
    }
    if (position == "DF") {
      added = this.addDF(player);
    }
    if (position == "MF") {
      added = this.addMF(player);
    }
    if (position == "FW") {
      added = this.addFW(player);
    }

    if (added) {
      this.players.push(player);
      this.teamService.playerAdded.next(player);
    }
  }

  isDuplicate(player: Player): boolean {
    let duplicateCount = this.players.filter(p => p.id == player.id).length;
    if (duplicateCount > 0) {
      return true;
    }
    return false;
  }

  addGK(player: Player): boolean {
    if (!this.goalkeeper) {
      this.goalkeeper = player;
      return true;
    } else if (!this.bench[0]) {
      this.bench[0] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Goalkeepers!");
    }
    return false;
  }

  addDF(player: Player): boolean {
    if (this.defenders.length < 4) {
      this.defenders.push(player);
      return true;
    } else if (!this.bench[1]) {
      this.bench[1] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Defenders!");
    }
    return false;
  }

  addMF(player: Player): boolean {
    if (this.midfielders.length < 4) {
      this.midfielders.push(player);
      return true;
    } else if (!this.bench[2]) {
      this.bench[2] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Midfielders!");
    }
    return false;
  }

  addFW(player: Player): boolean {
    if (this.forwards.length < 2) {
      this.forwards.push(player);
      return true;
    } else if (!this.bench[3]) {
      this.bench[3] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Forwards!");
    }
    return false;
  }

  removePlayer(player: Player) {
    // remove from position list
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
    // remove from players list
    this.players.splice(this.players.indexOf(player), 1);
  }

  removeGK(player: Player) {
    if(this.goalkeeper.id == player.id){
      this.goalkeeper = null;
    } else {
      this.bench[0] = null;
    }
  }

  removeDF(player: Player) {
    let indexOf = this.defenders.indexOf(player);
    if(indexOf > -1) {
      this.defenders.splice(indexOf, 1);
    } else {
      this.bench[1] = null;
    }
  }

  removeMF(player: Player) {
    let indexOf = this.midfielders.indexOf(player);
    if(indexOf > -1) {
      this.midfielders.splice(indexOf, 1);
    } else {
      this.bench[2] = null;
    }
  }

  removeFW(player: Player) {
    let indexOf = this.forwards.indexOf(player);
    if(indexOf > -1) {
      this.forwards.splice(indexOf, 1);
    } else {
      this.bench[3] = null;
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
