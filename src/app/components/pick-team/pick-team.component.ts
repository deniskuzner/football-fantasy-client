import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { Team } from 'src/app/models/team.model';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.css']
})
export class PickTeamComponent implements OnInit, OnDestroy {

  footballFieldMode: FootballFieldMode = FootballFieldMode.PICK_TEAM;
  authData: AuthData;

  team: Team;
  teamPlayers: TeamPlayer[] = [];
  signal: boolean;
  playerSwitchedSub: Subscription;
  captainChangedSub: Subscription;

  playerOut: TeamPlayer;
  playerIn: TeamPlayer;

  captain: TeamPlayer;
  viceCaptain: TeamPlayer;

  teamChanged: boolean = false;

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authData = this.authService.getAuthData();
    this.getTeam();
    this.playerSwitchedSub = this.teamService.playerSwitched.subscribe(
      res => {
        if (res) {
          this.switchPlayer(res);
        }
      }
    );
  }

  ngOnDestroy() {
    this.playerSwitchedSub.unsubscribe();
    this.captainChangedSub.unsubscribe();
  }

  getTeam() {
    this.signal = false;
    this.teamService.getTeamById(this.authData.teamId).subscribe(
      res => {
        this.initTeam(res);
        this.signal = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  initTeam(team: Team) {
    this.team = team;
    this.teamPlayers = [...this.team.teamPlayers];
    this.captain = this.teamPlayers.filter(tp => this.team.captainId == tp.player.id)[0];
    this.viceCaptain = this.teamPlayers.filter(tp => this.team.viceCaptainId == tp.player.id)[0];
  }

  getPlayerInImage() {
    if (this.playerIn) {
      return this.getPlayerImage(this.playerIn.player);
    }
    return '../../../assets/person.png';
  }

  getPlayerOutImage() {
    if (this.playerOut) {
      return this.getPlayerImage(this.playerOut.player);
    }
    return '../../../assets/person.png';
  }

  getPlayerImage(player: Player) {
    if (player.image.length) {
      return player.image;
    } else {
      return '../../../assets/person.png';
    }
  }

  getPlayerInName() {
    if (this.playerIn) {
      return this.playerIn.player.name;
    }
    return 'Select player';
  }

  getPlayerOutName() {
    if (this.playerOut) {
      return this.playerOut.player.name;
    }
    return 'Select player';
  }

  switchPlayer(player: Player) {
    let tp = this.teamPlayers.filter(tp => tp.player.id == player.id)[0];
    if (tp.onBench) {
      this.playerIn = tp;
      this.updatePlayerOut();
    } else {
      this.playerOut = tp;
      this.updatePlayerIn();
    }
  }

  updatePlayerOut() {
    if (!this.playerOut) {
      this.updatePlayerStyle();
      return;
    }
    if (this.playerOut.player.position != this.playerIn.player.position) {
      this.playerOut = null;
    }
    this.updatePlayerStyle();
  }

  updatePlayerIn() {
    let position = this.playerOut.player.position;
    let bench = this.teamPlayers.filter(tp => tp.onBench);
    if (position == "GK") {
      this.playerIn = bench.filter(tp => tp.player.position == "GK")[0];
    } else if (position == "DF") {
      this.playerIn = bench.filter(tp => tp.player.position == "DF")[0];
    } else if (position == "MF") {
      this.playerIn = bench.filter(tp => tp.player.position == "MF")[0];
    } else if (position == "FW") {
      this.playerIn = bench.filter(tp => tp.player.position == "FW")[0];
    }
    this.updatePlayerStyle();
  }

  updatePlayerStyle() {
    this.teamService.playerChanged.next(null);
    this.teamService.playerChanged.next(this.playerOut ? this.playerOut.player : null);
    this.teamService.playerChanged.next(this.playerIn ? this.playerIn.player : null);
  }

  onCaptainChange(data: { teamPlayer: TeamPlayer; type: String }) {
    if(data.type == 'CAPTAIN') {
      this.captain = data.teamPlayer;
    } else {
      this.viceCaptain = data.teamPlayer;
    }
    this.teamChanged = true;
  }

  cancel() {
    this.playerIn = null;
    this.playerOut = null;
    this.updatePlayerStyle();
  }

  confirmSwitch() {
    if (!this.playerIn || !this.playerOut) {
      return;
    }
    let inIndex = this.teamPlayers.indexOf(this.playerIn);
    let outIndex = this.teamPlayers.indexOf(this.playerOut);
    this.playerIn.onBench = false;
    this.playerOut.onBench = true;
    this.teamPlayers[outIndex] = this.playerIn;
    this.teamPlayers[inIndex] = this.playerOut;
    this.teamChanged = true;
    this.teamService.teamPlayersChanged.next(this.teamPlayers);
    this.cancel();
  }

  reset() {
    this.cancel();
    this.teamService.teamReset.next();
    this.captain = this.team.teamPlayers.filter(tp => this.team.captainId == tp.player.id)[0];
    this.viceCaptain = this.team.teamPlayers.filter(tp => this.team.viceCaptainId == tp.player.id)[0];
    this.teamChanged = false;
  }

  save() {
    this.team.teamPlayers = this.teamPlayers;
    this.team.captainId = this.captain.player.id;
    this.team.viceCaptainId = this.viceCaptain.player.id;
    this.teamService.save(this.team).subscribe(
      res => {
        this.initTeam(res);
        this.teamChanged = false;
        this.openSnackBar('Team saved!');
      },
      err => {
        console.log(err);
        this.openSnackBar('Error!');
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
