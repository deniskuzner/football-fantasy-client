import { Component, OnInit, ViewChild } from '@angular/core';
import { FixturesService } from '../../services/fixtures.service';
import { MatchEventService } from '../../services/match-event.service';
import { Gameweek } from '../../models/gameweek.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.css']
})
export class FixturesComponent implements OnInit {

  gameweeks: Gameweek[] = [];
  currentGameweekNumber: number = 1;
  signal: boolean = true;

  constructor(
    private fixturesService: FixturesService,
    private matchEventService: MatchEventService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.getFixtures();
  }

  getFixtures() {
    this.signal = false;
    this.fixturesService.getAll().subscribe(
      res => {
        this.gameweeks = res;
        this.signal = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  syncFixtures() {
    this.signal = false;
    this.fixturesService.parseSeasonFixtures().subscribe(
      () => {
        this.getFixtures();
        this.openSnackBar("Season fixtures synchronized successfully!");
      },
      err => {
        console.log(err);
      }
    );
  }

  syncGameweekMatchEvents() {
    this.signal = false;
    let currentGameweekId = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].id;
    this.matchEventService.parseGameweekMatchEvents(currentGameweekId).subscribe(
      () => {
        this.getFixtures();
        this.openSnackBar("Gameweek match events synchronized successfully!");
      },
      err => {
        console.log(err);
      }
    );
  }

  onCurrentGameweekNumberChange(currentGameweekNumber: number) {
    this.currentGameweekNumber = currentGameweekNumber;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
