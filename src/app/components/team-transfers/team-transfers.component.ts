import { Component, OnInit } from '@angular/core';
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
export class TeamTransfersComponent implements OnInit {

  footballFieldMode: FootballFieldMode = FootballFieldMode.TRANSFERS;
  team: Team;
  teamPlayers: TeamPlayer[] = [];
  moneyRemaining: number;
  freeTransfers: number;

  authData: AuthData;
  signal: boolean;
  changeSignal: boolean;
  currentGameweek: Gameweek;

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private fixturesService: FixturesService
  ) { }

  ngOnInit(): void {
    this.authData = this.authService.getAuthData();
    this.getTeam();
  }

  getTeam() {
    this.signal = false;
    this.teamService.getTeamById(this.authData.teamId).subscribe(
      res => {
        this.team = res;
        this.teamPlayers = [...this.team.teamPlayers];
        this.moneyRemaining = res.moneyRemaining;
        this.freeTransfers = res.freeTransfers;
        this.signal = true;
      },
      err => {
        console.log(err);
      }
    );
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
    console.log(player);
  }

  reset() {
    console.log('reset');
  }

  save() {
    console.log('save');
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

}
