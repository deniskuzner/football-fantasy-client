import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { PlayerGameweekPerformance } from 'src/app/models/player-gameweek-performance.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { PointsService } from 'src/app/services/points.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-football-field-player-dialog',
  templateUrl: './football-field-player-dialog.component.html',
  styleUrls: ['./football-field-player-dialog.component.css']
})
export class FootballFieldPlayerDialogComponent implements OnInit {

  teamPlayer: TeamPlayer;
  mode: String;
  title: String;

  performances: PlayerGameweekPerformance[] = [];
  displayedColumns: string[] = ['gameweek', 'points'];
  dataSource: MatTableDataSource<PlayerGameweekPerformance>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService,
    private pointsService: PointsService
  ) { }

  ngOnInit(): void {
    this.teamPlayer = this.data.teamPlayer;
    this.mode = this.data.mode;
    this.findPlayerPerformances();
  }

  findPlayerPerformances() {
    this.pointsService.findByPlayerId(this.teamPlayer.player.id).subscribe(
      res => {
        this.performances = res;
        this.setTableData();
      },
      err => {
        console.log(err);
      }
    );
  }

  setTableData() {
    this.dataSource = new MatTableDataSource(this.performances);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.firstPage();
  }

  remove() {
    this.teamService.playerRemoved.next(this.teamPlayer);
  }

  switch() {
    this.teamService.playerSwitched.next(this.teamPlayer);
  }

  makeCaptain() {
    this.teamService.captainChanged.next({teamPlayer: this.teamPlayer, type: 'CAPTAIN'});
  }

  makeViceCaptain() {
    this.teamService.captainChanged.next({teamPlayer: this.teamPlayer, type: 'VICE_CAPTAIN'});
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

  showRemoveBtn(): boolean {
    if(this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return true;
    }
    return false;
  }

  showSwitchBtn(): boolean {
    if(this.mode == FootballFieldMode.PICK_TEAM) {
      return true;
    }
    return false;
  }

  showCaptainBtn(): boolean {
    if(this.mode == FootballFieldMode.PICK_TEAM) {
      return true;
    }
    return false;
  }

}
