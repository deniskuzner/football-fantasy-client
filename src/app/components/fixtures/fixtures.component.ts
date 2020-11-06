import { Component, OnInit } from '@angular/core';
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

  selectedGameweek: Gameweek;
  signal: boolean = true;

  constructor(
    private fixturesService: FixturesService,
    private matchEventService: MatchEventService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  syncFixtures() {
    this.signal = false;
    this.fixturesService.parseSeasonFixtures().subscribe(
      () => {
        this.openSnackBar("Season fixtures synchronized successfully!");
        this.fixturesService.fixturesUpdated.next();
        this.signal = true;
      },
      err => {
        console.log(err);
        this.signal = true;
        this.openSnackBar("Error!");
      }
    );
  }

  syncGameweekMatchEvents() {
    if(!this.selectedGameweek) {
      this.openSnackBar("Please first sync season fixtures!");
      return;
    }
    this.signal = false;
    let selectedGameweekId = this.selectedGameweek.id;
    this.matchEventService.parseGameweekMatchEvents(selectedGameweekId).subscribe(
      () => {
        this.openSnackBar("Gameweek match events synchronized successfully!");
        this.fixturesService.fixturesUpdated.next();
      },
      err => {
        console.log(err);
        this.signal = true;
        this.openSnackBar("Error!");
      }
    );
  }

  onSelectedGameweekChange(selectedGameweek: Gameweek) {
    this.selectedGameweek = selectedGameweek;
    this.signal = true;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
