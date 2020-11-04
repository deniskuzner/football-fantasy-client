import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Gameweek } from 'src/app/models/gameweek.model';
import { FixturesService } from 'src/app/services/fixtures.service';

@Component({
  selector: 'app-gameweek',
  templateUrl: './gameweek.component.html',
  styleUrls: ['./gameweek.component.css']
})
export class GameweekComponent implements OnInit {

  @Output() currentGameweekChange = new EventEmitter<Gameweek>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  gameweek: Gameweek;
  currentGameweekNumber: number = 1;
  signal: boolean = true;

  constructor(
    private fixturesService: FixturesService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCurrentGameweek();
  }

  getCurrentGameweek() {
    this.signal = false;
    this.fixturesService.getByOrderNumber(this.currentGameweekNumber).subscribe(
      res => {
        this.gameweek = res;
        this.currentGameweekChange.emit(this.gameweek);
        this.signal = true;
      },
      err => {
        this.signal = true;
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  onCurrentGameweekChange(currentGameweekNumber: number) {
    this.currentGameweekNumber = currentGameweekNumber;
    this.getCurrentGameweek();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
