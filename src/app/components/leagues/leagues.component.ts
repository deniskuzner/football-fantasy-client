import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamLeagueMembership } from 'src/app/models/team-league-membership.model';
import { League } from 'src/app/models/league.model';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { LeagueService } from 'src/app/services/league.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/team.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.css']
})
export class LeaguesComponent implements OnInit {

  authData: AuthData;
  nameInput: String;
  idInput: number;
  leaguesColumns: string[] = ['id', 'name', 'owner', 'action'];
  teamsColumns: string[] = ['orderNumber', 'teamName', 'user', 'totalPoints'];
  leaguesDataSource: MatTableDataSource<League>;
  teamsDataSource: MatTableDataSource<Team>;
  @ViewChild('leaguesPaginator', { static: true }) leaguesPaginator: MatPaginator;
  @ViewChild('teamsPaginator', { static: true }) teamsPaginator: MatPaginator;

  leagues: League[] = [];
  selectedLeague: League;
  selectedLeagueTeams: Team[] = [];

  constructor(
    private authService: AuthService,
    private leagueService: LeagueService,
    private teamService: TeamService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authData = this.authService.getAuthData();
    this.findTeamLeagues();
  }

  findTeamLeagues() {
    this.leagueService.findByTeamId(this.authData.teamId).subscribe(
      res => {
        this.leagues = res;
        this.setLeaguesTableData();
      },
      err => {
        console.log(err);
        this.openSnackBar('Error!');
      }
    );
  }

  create() {
    let league = new League(null, this.nameInput, this.authData.id);
    this.leagueService.create(league).subscribe(
      res => {
        this.join(res.id);
        this.openSnackBar('League created!');
      },
      err => {
        console.log(err);
        this.openSnackBar('Error!');
      }
    );
  }

  join(leagueId: number) {
    let tlm = new TeamLeagueMembership(null, this.authData.teamId, leagueId);
    this.leagueService.join(tlm).subscribe(
      res => {
        this.leagues.push(res);
        this.setLeaguesTableData();
      },
      err => {
        console.log(err);
        if (err.error.includes('[LEAGUE_NOT_FOUND]')) {
          this.openSnackBar(err.error.split('[LEAGUE_NOT_FOUND] ')[1]);
        } else if (err.error.includes('[LEAGUE_MEMBER_DUPLICATE]')) {
          this.openSnackBar(err.error.split('[LEAGUE_MEMBER_DUPLICATE] ')[1]);
        } else {
          this.openSnackBar('Error!');
        }
      }
    );
  }

  details(league: League) {
    if (!this.selectedLeague) {
      this.selectedLeague = league;
    } else if (this.selectedLeague.id == league.id) {
      this.selectedLeague = null;
      this.selectedLeagueTeams = null;
    } else {
      this.selectedLeague = league;
    }
    if (this.selectedLeague) {
      this.findLeagueTeams(this.selectedLeague.id);
    }
  }

  findLeagueTeams(leagueId: number) {
    this.teamService.getTeamsByLeagueId(leagueId).subscribe(
      res => {
        this.selectedLeagueTeams = res;
        this.setTeamsTableData();
      },
      err => {
        console.log(err);
      }
    );
  }

  remove(league: League) {
    if(this.isOwner(league)) {
      this.deleteLeague(league);
    } else {
      this.leaveLeague(league);
    }
  }

  selectTeam(team: Team) {
    if(team.user.id == this.authData.id) {
      this.router.navigate(['team-points']);
    } else {
      this.router.navigate(['team', team.id ]);
    }

  }

  deleteLeague(league: League) {
    this.leagueService.deleteLeagueById(league.id).subscribe(
      () => {
        this.findTeamLeagues();
        this.selectedLeague = null;
      },
      err => {
        console.log(err);
        this.openSnackBar('Error!');
      }
    );
  }

  leaveLeague(league: League) {
    this.leagueService.deleteMembership(this.authData.teamId, league.id).subscribe(
      () => {
        this.findTeamLeagues();
        this.selectedLeague = null;
      },
      err => {
        console.log(err);
        this.openSnackBar('Error!');
      }
    );
  }

  setLeaguesTableData() {
    this.leaguesDataSource = new MatTableDataSource(this.leagues);
    this.leaguesDataSource.paginator = this.leaguesPaginator;
    this.leaguesDataSource.paginator.firstPage();
  }

  setTeamsTableData() {
    this.teamsDataSource = new MatTableDataSource(this.selectedLeagueTeams);
    this.teamsDataSource.paginator = this.teamsPaginator;
    this.teamsDataSource.paginator.firstPage();
  }

  isOwner(league: League) {
    if(!league) {
      return false;
    }
    if (league.ownerId == this.authData.id) {
      return true;
    }
    return false;
  }

  isSelected(league: League) {
    if (!this.selectedLeague) {
      return false;
    } else if (this.selectedLeague.id == league.id) {
      return true;
    } else {
      return false;
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
