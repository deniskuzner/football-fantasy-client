import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { Team } from 'src/app/models/team.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { TeamService } from 'src/app/services/team.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SaveTeamDialogComponent } from '../dialogs/save-team-dialog/save-team-dialog.component';
import { Router } from '@angular/router';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnInit, OnDestroy {

  teamPlayers: TeamPlayer[] = [];
  footballFieldMode: FootballFieldMode = FootballFieldMode.TEAM_SELECTION;

  goalkeeper: TeamPlayer;
  defenders: TeamPlayer[] = [];
  midfielders: TeamPlayer[] = [];
  forwards: TeamPlayer[] = [];
  bench: TeamPlayer[] = [];
  name: string;
  captain: number;
  viceCaptain: number;

  money: number = 100.0;

  playerRemovedSub: Subscription;
  authData: AuthData;

  constructor(
    private teamService: TeamService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authData = this.authService.getAuthData();
    if(this.authData.teamId) {
      this.router.navigate(['/pick-team']);
    }
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

    if (this.money - player.price < 0) {
      this.openSnackBar("You don't have enough money for " + player.name + "!");
      return;
    }

    if (!this.checkClubLimit(player)) {
      this.openSnackBar("You already have 3 players from " + player.club.name + "!");
      return;
    }

    let position = player.position;
    let teamPlayer = null;
    if (position == "GK") {
      teamPlayer = this.addGK(player);
    }
    if (position == "DF") {
      teamPlayer = this.addDF(player);
    }
    if (position == "MF") {
      teamPlayer = this.addMF(player);
    }
    if (position == "FW") {
      teamPlayer = this.addFW(player);
    }

    if (teamPlayer) {
      this.teamPlayers.push(teamPlayer);
      this.teamService.playerAdded.next(teamPlayer);
      this.money = Math.round((this.money - player.price) * 10) / 10;
    }
  }

  isDuplicate(player: Player): boolean {
    let duplicateCount = this.teamPlayers.filter(tp => tp.player.id == player.id).length;
    if (duplicateCount > 0) {
      return true;
    }
    return false;
  }

  checkClubLimit(player: Player): boolean {
    let sameClubCount = this.teamPlayers.filter(tp => tp.player.club.id == player.club.id).length;
    if (sameClubCount > 2) {
      return false;
    }
    return true;
  }

  addGK(player: Player): TeamPlayer {
    if (!this.goalkeeper) {
      this.goalkeeper = new TeamPlayer(null, 0, false, player);
      return this.goalkeeper;
    } else if (!this.bench[0]) {
      this.bench[0] = new TeamPlayer(null, 0, true, player);
      return this.bench[0];
    } else {
      this.openSnackBar("You already have the maximum number of Goalkeepers!");
    }
    return null;
  }

  addDF(player: Player): TeamPlayer {
    if (this.defenders.length < 4) {
      let teamPlayer = new TeamPlayer(null, 0, false, player);
      this.defenders.push(teamPlayer);
      return teamPlayer;
    } else if (!this.bench[1]) {
      this.bench[1] = new TeamPlayer(null, 0, true, player);
      return this.bench[1];
    } else {
      this.openSnackBar("You already have the maximum number of Defenders!");
    }
    return null;
  }

  addMF(player: Player): TeamPlayer {
    if (this.midfielders.length < 4) {
      let teamPlayer = new TeamPlayer(null, 0, false, player);
      this.midfielders.push(teamPlayer);
      return teamPlayer;
    } else if (!this.bench[2]) {
      this.bench[2] = new TeamPlayer(null, 0, true, player);
      return this.bench[2];
    } else {
      this.openSnackBar("You already have the maximum number of Midfielders!");
    }
    return null;
  }

  addFW(player: Player): TeamPlayer {
    if (this.forwards.length < 2) {
      let teamPlayer = new TeamPlayer(null, 0, false, player);
      this.forwards.push(teamPlayer);
      return teamPlayer;
    } else if (!this.bench[3]) {
      this.bench[3] = new TeamPlayer(null, 0, true, player);
      return this.bench[3];
    } else {
      this.openSnackBar("You already have the maximum number of Forwards!");
    }
    return null;
  }

  removePlayer(teamPlayer: TeamPlayer) {
    // remove from position list
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
    // remove from players list
    this.teamPlayers.splice(this.teamPlayers.indexOf(teamPlayer), 1);
    // update money
    this.money = Math.round((this.money + teamPlayer.player.price) * 10) / 10;
  }

  removeGK(teamPlayer: TeamPlayer) {
    let onBench = teamPlayer.onBench;
    if(onBench) {
      this.bench[0] = null;
    } else {
      this.goalkeeper = null;
    }
  }

  removeDF(teamPlayer: TeamPlayer) {
    let indexOf = this.defenders.indexOf(teamPlayer);
    if (indexOf > -1) {
      this.defenders.splice(indexOf, 1);
    } else {
      this.bench[1] = null;
    }
  }

  removeMF(teamPlayer: TeamPlayer) {
    let indexOf = this.midfielders.indexOf(teamPlayer);
    if (indexOf > -1) {
      this.midfielders.splice(indexOf, 1);
    } else {
      this.bench[2] = null;
    }
  }

  removeFW(teamPlayer: TeamPlayer) {
    let indexOf = this.forwards.indexOf(teamPlayer);
    if (indexOf > -1) {
      this.forwards.splice(indexOf, 1);
    } else {
      this.bench[3] = null;
    }
  }

  reset() {
    this.teamPlayers = [];
    this.goalkeeper = null;
    this.defenders = [];
    this.midfielders = [];
    this.forwards = [];
    this.bench = [];
    this.money = 100.0;
    this.teamService.teamReset.next();
  }

  save() {
    const dialogRef = this.dialog.open(SaveTeamDialogComponent, { data: { teamPlayers: this.teamPlayers } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.setDialogData(result);
        let user = new User(this.authData.id, null, null, null, null, null, null, null, null, null, null);
        let team = new Team(null, this.name, 2, 0, this.captain, this.viceCaptain, this.money, user, []);
        team.teamPlayers = this.teamPlayers;
        this.teamService.save(team).subscribe(
          res => {
            this.authService.setTeam(res);
            this.router.navigate(['/pick-team']);
          },
          err => {
            console.log(err);
            this.openSnackBar("Error!");
          }
        );
      }
    });
  }

  setDialogData(result: any) {
    this.name = result.data.name;
    this.captain = result.data.captain;
    this.viceCaptain = result.data.viceCaptain;
  }

  getPlayersSelectedColor() {
    if (this.teamPlayers.length == 15) {
      return "green";
    } else {
      return "crimson";
    }
  }

  getMoneyColor() {
    if (this.money > 0) {
      return "green";
    } else {
      return "crimson";
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
