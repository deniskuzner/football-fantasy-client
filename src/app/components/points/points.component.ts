import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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

  selectedGameweekPerformances: PlayerGameweekPerformance[] = [];
  selectedGameweekNumber: number = 1;
  gameweekOrderNumbers: number[] = [];
  fromDate: Date;
  toDate: Date;
  selectedGameweekOption: number;
  signal: boolean = true;
  fixturesUpdatedSub: Subscription;

  displayedColumns: string[] = ['image', 'clubImage', 'name', 'position', 'points'];
  dataSource = new MatTableDataSource<PlayerGameweekPerformance>(this.selectedGameweekPerformances);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private fixturesService: FixturesService,
    private pointsService: PointsService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.count();
    this.getCurrentGameweek();
    this.fixturesUpdatedSub = this.fixturesService.fixturesUpdated.subscribe(
      () => {
        this.count();
      }
    );
  }

  ngOnDestroy() {
    this.fixturesUpdatedSub.unsubscribe();
  }

  count() {
    this.fixturesService.count().subscribe(
      res => {
        this.gameweekOrderNumbers = Array.from({length: res}, (_, index) => index + 1);
      },
      err => {
        console.log(err);
      }
    );
  }

  getCurrentGameweek() {
    this.signal = false;
    this.fixturesService.getCurrentGameweek().subscribe(
      res => {
        if(res) {
          this.selectedGameweekPerformances = res.playerGameweekPerformances;
        }
        this.setTableData();
        this.signal = true;
      },
      err => {
        this.signal = true;
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  getSelectedGameweek() {
    this.signal = false;
    this.fixturesService.getByOrderNumber(this.selectedGameweekNumber).subscribe(
      res => {
        this.selectedGameweekPerformances = res.playerGameweekPerformances;
        this.setTableData();
        this.signal = true;
      },
      err => {
        this.signal = true;
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  setTableData() {
    this.dataSource = new MatTableDataSource(this.selectedGameweekPerformances);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage();
  }

  onSelectedGameweekChange(selectedGameweekNumber: number) {
    this.selectedGameweekNumber = selectedGameweekNumber;
    this.getSelectedGameweek();
    this.setTableData();
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

  calculateByDate(form: NgForm) {
    this.signal = false;
    if (form.valid) {
      let fromDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), 0, 0, 0);
      let toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(), 23, 59, 59);
      let searchRequest = { fromDate: fromDate, toDate: toDate };
      this.pointsService.calculateByDate(searchRequest).subscribe(
        () => {
          this.getSelectedGameweek();
          this.signal = true;
          this.openSnackBar("Gameweek points calculated successfully!");
        },
        err => {
          console.log(err);
          this.signal = true;
          this.openSnackBar("Error!");
        }
      );
    } else {
      this.openSnackBar("Please select dates!");
    }
  }

  calculateByGameweek() {
    this.signal = false;
    if (this.selectedGameweekOption) {
      this.pointsService.calculateByGameweek(this.selectedGameweekOption).subscribe(
        () => {
          this.getSelectedGameweek();
          this.signal = true;
          this.openSnackBar("Gameweek points calculated successfully!");
        },
        err => {
          console.log(err);
          this.signal = true;
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
