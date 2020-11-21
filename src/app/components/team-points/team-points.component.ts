import { Component, OnInit } from '@angular/core';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Team } from 'src/app/models/team.model';
import { AuthData, AuthService } from 'src/app/services/auth.service';
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

  constructor(
    private teamService: TeamService,
    private authService: AuthService
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
        this.signal = true;
      },
      err => {
        console.log(err);
      }
    );
  }

}
