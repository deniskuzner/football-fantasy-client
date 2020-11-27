import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Club } from 'src/app/models/club.model';
import { League } from 'src/app/models/league.model';
import { Player } from 'src/app/models/player.model';
import { TeamGameweekPerformance } from 'src/app/models/team-gameweek-performance.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { Team } from 'src/app/models/team.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClubService } from 'src/app/services/club.service';
import { LeagueService } from 'src/app/services/league.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit, OnDestroy {

  @Input() team: Team;
  @Output() captainChanged = new EventEmitter<{teamPlayer: TeamPlayer, type: String}>();
  teamPlayers: TeamPlayer[] = [];
  captain: TeamPlayer;
  viceCaptain: TeamPlayer;
  teamValue: number = 0;
  favouriteClub: Club;
  performances: TeamGameweekPerformance[] = [];
  leagues: League[] = [];
  
  leaguesColumns: string[] = ['id', 'name'];
  leaguesDataSource: MatTableDataSource<League>;
  @ViewChild('leaguesPaginator', { static: true }) leaguesPaginator: MatPaginator;
  
  performancesColumns: string[] = ['orderNumber', 'points'];
  performancesDataSource: MatTableDataSource<TeamGameweekPerformance>;
  @ViewChild('performancesPaginator', { static: true }) performancesPaginator: MatPaginator;

  captainChangedSub: Subscription;
  teamResetSub: Subscription;

  constructor(
    private teamService: TeamService,
    private clubService: ClubService,
    private authService: AuthService,
    private leagueService: LeagueService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getFavouriteClub();
    this.initTeam();
    this.findTeamLeagues();
    this.captainChangedSub = this.teamService.captainChanged.subscribe(
      res => {
        this.changeCaptain(res);
      }
    );
    this.teamResetSub = this.teamService.teamReset.subscribe(
      () => {
        this.resetTeam();
      }
    );
  }

  ngOnDestroy() {
    this.captainChangedSub.unsubscribe();
    this.teamResetSub.unsubscribe();
  }

  getFavouriteClub() {
    this.clubService.getFavouriteClub(this.authService.getAuthData().id).subscribe(
      res => {
        this.favouriteClub = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  findTeamLeagues() {
    this.leagueService.findByTeamId(this.authService.getAuthData().teamId).subscribe(
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

  initTeam() {
    this.teamPlayers = [...this.team.teamPlayers];
    this.captain = this.teamPlayers.filter(tp => this.team.captainId == tp.player.id)[0];
    this.viceCaptain = this.teamPlayers.filter(tp => this.team.viceCaptainId == tp.player.id)[0];
    this.teamValue = Math.round(this.teamPlayers.reduce((a,b) => a + b.player.price, 0) * 10) / 10;
    this.performances = this.team.teamGameweekPerformances.sort((a,b) => a.gameweek.id - b.gameweek.id);
    this.setPerformancesTableData();
  }

  setLeaguesTableData() {
    this.leaguesDataSource = new MatTableDataSource(this.leagues);
    this.leaguesDataSource.paginator = this.leaguesPaginator;
    this.leaguesDataSource.paginator.firstPage();
  }

  setPerformancesTableData() {
    this.performancesDataSource = new MatTableDataSource(this.performances);
    this.performancesDataSource.paginator = this.performancesPaginator;
    this.performancesDataSource.paginator.firstPage();
  }

  getPlayerImage(player: Player) {
    if (player.image.length) {
      return player.image;
    } else {
      return '../../../assets/person.png';
    }
  }

  changeCaptain(data: { teamPlayer: TeamPlayer; type: String }) {
    if (data.type == 'CAPTAIN') {
      if (this.captain.id == data.teamPlayer.id) {
        return;
      }
      if(this.viceCaptain.id == data.teamPlayer.id) {
        this.openSnackBar(data.teamPlayer.player.name + ' is already Vice Captain!');
        return;
      }
      this.captain = data.teamPlayer;
      this.captainChanged.emit({teamPlayer: this.captain, type: 'CAPTAIN'});
    } else {
      if (this.viceCaptain.id == data.teamPlayer.id) {
        return;
      }
      if(this.captain.id == data.teamPlayer.id) {
        this.openSnackBar(data.teamPlayer.player.name + ' is already Captain!');
        return;
      }
      this.viceCaptain = data.teamPlayer;
      this.captainChanged.emit({teamPlayer: this.viceCaptain, type: 'VICE_CAPTAIN'});
    }
  }

  resetTeam() {
    this.captain = this.teamPlayers.filter(tp => this.team.captainId == tp.player.id)[0];
    this.viceCaptain = this.teamPlayers.filter(tp => this.team.viceCaptainId == tp.player.id)[0];
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
