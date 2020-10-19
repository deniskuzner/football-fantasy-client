import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Gameweek } from 'src/app/models/gameweek.model';
import { PlayerGameweekPerformance } from 'src/app/models/player-gameweek-performance.model';
import { FixturesService } from 'src/app/services/fixtures.service';
import { PointsService } from 'src/app/services/points.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit, OnDestroy {

  gameweeks: Gameweek[] = [];
  currentGameweekPerformances: PlayerGameweekPerformance[] = [];
  currentGameweekNumber: number = 1;
  fromDate: Date;
  toDate: Date;
  selectedGameweekOrderNumber: number;
  signal: boolean = true;

  displayedColumns: string[] = ['image', 'clubImage', 'name', 'position', 'points'];
  dataSource = new MatTableDataSource<PlayerGameweekPerformance>(this.currentGameweekPerformances);
  private fixturesChangedSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fixturesService: FixturesService,
    private pointsService: PointsService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getFixtures();
    this.fixturesChangedSub = this.fixturesService.fixturesUpdated.subscribe(
      () => {
        this.getFixtures();
      }
    );
  }

  ngOnDestroy() {
    this.fixturesChangedSub.unsubscribe();
  }

  setTableData() {
    this.dataSource = new MatTableDataSource(this.currentGameweekPerformances);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage();
  }

  getFixtures() {
    this.signal = false;
    this.fixturesService.getAll().subscribe(
      res => {
        this.gameweeks = res;
        if (this.gameweeks.length > 0) {
          this.currentGameweekPerformances = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].playerGameweekPerformances;
        }
        this.setTableData();
        this.signal = true;
      },
      err => {
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  onCurrentGameweekNumberChange(currentGameweekNumber: number) {
    this.currentGameweekNumber = currentGameweekNumber;
    this.currentGameweekPerformances = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].playerGameweekPerformances;
    this.setTableData();
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

  calculateByDate(form: NgForm) {
    if (form.valid) {
      let fromDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), 0, 0, 0);
      let toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(), 23, 59, 59);
      let searchRequest = { fromDate: fromDate, toDate: toDate };
      this.pointsService.calculateByDate(searchRequest).subscribe(
        () => {
          this.getFixtures();
          this.openSnackBar("Gameweek points calculated successfully!");
        },
        err => {
          console.log(err);
          this.openSnackBar("Error!");
        }
      );
    } else {
      this.openSnackBar("Please select dates!");
    }
  }

  calculateByGameweek() {
    if (this.selectedGameweekOrderNumber) {
      let gameweek = this.gameweeks.filter(g => g.orderNumber == this.selectedGameweekOrderNumber)[0];
      this.pointsService.calculateByGameweek(gameweek.id).subscribe(
        res => {
          gameweek.playerGameweekPerformances.push(...res);
          this.currentGameweekPerformances = gameweek.playerGameweekPerformances;
          this.setTableData();
          this.openSnackBar("Gameweek points calculated successfully!");
        },
        err => {
          console.log(err);
          this.openSnackBar("Error!");
        }
      );
    } else {
      this.openSnackBar("Please select gameweek!");
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
