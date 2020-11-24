import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Gameweek } from 'src/app/models/gameweek.model';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { Team } from 'src/app/models/team.model';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { FixturesService } from 'src/app/services/fixtures.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-transfers',
  templateUrl: './team-transfers.component.html',
  styleUrls: ['./team-transfers.component.css']
})
export class TeamTransfersComponent implements OnInit, OnDestroy {

  footballFieldMode: FootballFieldMode = FootballFieldMode.TRANSFERS;
  team: Team;
  teamPlayers: TeamPlayer[] = [];
  goalkeeper: TeamPlayer;
  defenders: TeamPlayer[] = [];
  midfielders: TeamPlayer[] = [];
  forwards: TeamPlayer[] = [];
  bench: TeamPlayer[] = [];
  moneyRemaining: number;

  authData: AuthData;
  signal: boolean;
  changeSignal: boolean;
  currentGameweek: Gameweek;

  playerRemovedSub: Subscription;

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private fixturesService: FixturesService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authData = this.authService.getAuthData();
    this.getTeam();
    this.playerRemovedSub = this.teamService.playerRemoved.subscribe(
      res => {
        this.removePlayer(res);
      }
    );
  }

  ngOnDestroy() {
    this.playerRemovedSub.unsubscribe();
  }

  getTeam() {
    this.signal = false;
    this.teamService.getTeamById(this.authData.teamId).subscribe(
      res => {
        this.team = res;
        this.setTeamData();
        this.signal = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  setTeamData() {
    this.teamPlayers = [...this.team.teamPlayers];
    this.splitPlayersByPosition();
    this.moneyRemaining = this.team.moneyRemaining;
  }

  splitPlayersByPosition() {
    this.goalkeeper = this.teamPlayers.filter(tp => !tp.onBench && tp.player.position == 'GK')[0];
    this.defenders = this.teamPlayers.filter(tp => !tp.onBench && tp.player.position == 'DF');
    this.midfielders = this.teamPlayers.filter(tp => !tp.onBench && tp.player.position == 'MF');
    this.forwards = this.teamPlayers.filter(tp => !tp.onBench && tp.player.position == 'FW');
    this.bench = this.teamPlayers.filter(tp => tp.onBench);
  }

  getCurrentGameweek() {
    this.fixturesService.getCurrentGameweek().subscribe(
      res => {
        this.currentGameweek = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onPlayerAdded(player: Player) {
    if (this.isDuplicate(player)) {
      this.openSnackBar(player.name + " is already in your squad!");
      return;
    }

    if (this.moneyRemaining - player.price < 0) {
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
      this.moneyRemaining = Math.round((this.moneyRemaining - player.price) * 10) / 10;
      this.changeSignal = true;
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
    this.moneyRemaining = Math.round((this.moneyRemaining + teamPlayer.player.price) * 10) / 10;
    this.changeSignal = true;
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
    this.setTeamData();
    this.teamService.teamReset.next();
    this.changeSignal = false;
  }

  save() {
    this.team.teamPlayers = this.teamPlayers;
    this.team.moneyRemaining = this.moneyRemaining;
    this.teamService.save(this.team).subscribe(
      res => {
        this.team = res;
        this.setTeamData();
        this.changeSignal = false;
        this.openSnackBar("Team saved!")
      },
      err => {
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  getPlayersSelectedColor() {
    if (this.teamPlayers.length == 15) {
      return "green";
    } else {
      return "crimson";
    }
  }

  getMoneyColor() {
    if (this.moneyRemaining > 0) {
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
