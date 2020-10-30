import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerGameweekPerformance } from 'src/app/models/player-gameweek-performance.model';
import { Player } from 'src/app/models/player.model';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-select-player-dialog',
  templateUrl: './select-player-dialog.component.html',
  styleUrls: ['./select-player-dialog.component.css']
})
export class SelectPlayerDialogComponent implements OnInit {

  player: Player;
  performances: PlayerGameweekPerformance[] = [];
  displayedColumns: string[] = ['gameweek', 'points'];
  signal = true;

  dataSource: MatTableDataSource<PlayerGameweekPerformance>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pointsService: PointsService
  ) { }

  ngOnInit(): void {
    this.player = this.data.player;
    this.findPlayerPerformances();
  }

  findPlayerPerformances() {
    this.signal = false;
    this.pointsService.findByPlayerId(this.player.id).subscribe(
      res => {
        this.performances = res;
        this.setTableData();
        this.signal = true;
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

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

}
