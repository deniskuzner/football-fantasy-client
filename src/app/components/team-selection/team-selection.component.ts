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

    // PROVERTI U PLAYERS LISTI DA LI VEC POSTOJI TAJ IGRAC
    // ISPOD UBACITI DODAVANJE U PLAYERS LISTU

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

    if(added) {
      this.teamService.playerAdded.next(player);
    }
  }

  addGK(player: Player): boolean {
    if(!this.goalkeeper) {
      this.goalkeeper = player;
      return true;
    } else if(!this.bench[0]) {
      this.bench[0] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Goalkeepers!");
    }
    return false;
  }

  addDF(player: Player): boolean {
    if(this.defenders.length < 4) {
      this.defenders.push(player);
      return true;
    } else if(!this.bench[1]) {
      this.bench[1] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Defenders!");
    }
    return false;
  }

  addMF(player: Player): boolean {
    if(this.midfielders.length < 4) {
      this.midfielders.push(player);
      return true;
    } else if(!this.bench[2]) {
      this.bench[2] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Midfielders!");
    }
    return false;
  }
  
  addFW(player: Player): boolean {
    if(this.forwards.length < 2) {
      this.forwards.push(player);
      return true;
    } else if(!this.bench[3]) {
      this.bench[3] = player;
      return true;
    } else {
      this.openSnackBar("You already have the maximum number of Forwards!");
    }
    return false;
  }

  removePlayer(player: Player) {
    // LOGIKA ZA BRISANJE IGRACA
    // IZ PLAYERS LISTE I IZ LISTE ZA POZICIJU
    console.log(player);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
