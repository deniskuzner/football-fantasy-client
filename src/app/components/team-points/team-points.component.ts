import { Component, OnInit } from '@angular/core';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Gameweek } from 'src/app/models/gameweek.model';
import { Team } from 'src/app/models/team.model';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { FixturesService } from 'src/app/services/fixtures.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-points',
  templateUrl: './team-points.component.html',
  styleUrls: ['./team-points.component.css']
})
export class TeamPointsComponent implements OnInit {

  footballFieldMode: FootballFieldMode = FootballFieldMode.POINTS;
  team: Team;
  authData: AuthData;
  signal: boolean;

  gwPoints: number = 0;
  currentGameweek: Gameweek;
  gwStats: { rank: number, averagePoints: number, highestPoints: number };

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
    this.teamService.getTeamById(this.authData.teamId).subscribe(
      res => {
        this.team = res;
        this.getCurrentGameweek();
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
        this.setGameweekData();
      },
      err => {
        console.log(err);
      }
    );
  }

  setGameweekData() {
    let tgp = this.team.teamGameweekPerformances.filter(tgp => tgp.gameweek.id == this.currentGameweek.id);
    if (tgp.length > 0) {
      this.gwPoints = tgp[0].points;
      this.getGWStats();
    } else {
      this.gwPoints = 0;
      this.teamService.newGameweekPoints.next();
    }
  }

  getGWStats() {
    this.teamService.getGameweekStats(this.authData.teamId, this.currentGameweek.id).subscribe(
      res => {
        this.gwStats = res;
      },
      err => {
        console.log(err);
      }
    );
  }

}
