import { Component, OnDestroy, OnInit } from '@angular/core';
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

  playerOut: TeamPlayer;
  playerIn: TeamPlayer;

  teamChanged: boolean = false;

  constructor(
    private authService: AuthService,
    private teamService: TeamService
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
  }

  getTeam() {
    this.signal = false;
    this.teamService.getTeamById(this.authData.teamId).subscribe(
      res => {
        this.team = res;
        this.teamPlayers = [...this.team.teamPlayers];
        this.signal = true;
      }
    );
  }

  getPlayerInImage() {
    if (this.playerIn) {
      if (this.playerIn.player.image.length) {
        return this.playerIn.player.image;
      } else {
        return '../../../assets/person.png';
      }
    }
    return '../../../assets/person.png';
  }

  getPlayerOutImage() {
    if (this.playerOut) {
      if (this.playerOut.player.image.length) {
        return this.playerOut.player.image;
      } else {
        return '../../../assets/person.png';
      }
    }
    return '../../../assets/person.png';
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
    let tp = this.team.teamPlayers.filter(tp => tp.player.id == player.id)[0];
    if (tp.onBench) {
      this.playerOut = tp;
      this.updatePlayerIn();
    } else {
      this.playerIn = tp;
      this.updatePlayerOut();
    }
  }

  updatePlayerIn() {
    if (!this.playerIn) {
      return;
    }
    if (this.playerIn.player.position != this.playerOut.player.position) {
      this.playerIn = null;
    }
    this.updatePlayerStyle();
  }

  updatePlayerOut() {
    let position = this.playerIn.player.position;
    let bench = this.teamPlayers.filter(tp => tp.onBench);
    if (position == "GK") {
      this.playerOut = bench.filter(tp => tp.player.position == "GK")[0];
    } else if (position == "DF") {
      this.playerOut = bench.filter(tp => tp.player.position == "DF")[0];
    } else if (position == "MF") {
      this.playerOut = bench.filter(tp => tp.player.position == "MF")[0];
    } else if (position == "FW") {
      this.playerOut = bench.filter(tp => tp.player.position == "FW")[0];
    }
    this.updatePlayerStyle();
  }

  updatePlayerStyle() {
    this.teamService.playerChanged.next(null);
    this.teamService.playerChanged.next(this.playerIn ? this.playerIn.player : null);
    this.teamService.playerChanged.next(this.playerOut ? this.playerOut.player : null);
  }

  cancel() {
    this.playerIn = null;
    this.playerOut = null;
    this.updatePlayerStyle();
  }

  confirmSwitch() {

  }

  reset() {
    this.cancel();
    // RESTARTOVATI CELU POSTAVU NA POCETNU
  }

  save() {

  }

}
