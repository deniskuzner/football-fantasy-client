import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamLeagueMembership } from 'src/app/models/team-league-membership.model';
import { League } from 'src/app/models/league.model';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { LeagueService } from 'src/app/services/league.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.css']
})
export class LeaguesComponent implements OnInit {

  authData: AuthData;
  nameInput: String;
  idInput: number;
  displayedColumns: string[] = ['id', 'name', 'owner', 'action'];
  dataSource: MatTableDataSource<League>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  leagues: League[] = [];

  constructor(
    private authService: AuthService,
    private leagueService: LeagueService,
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
        this.setTableData();
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
        this.setTableData();
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

  }

  remove(league: League) {
    
  }

  setTableData() {
    this.dataSource = new MatTableDataSource(this.leagues);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.firstPage();
  }

  isOwner(ownerId: number) {
    if(ownerId == this.authData.id) {
      return true;
    }
    return false;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
