import { Component, OnInit, Output, ViewChild, EventEmitter, OnDestroy, Input } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Gameweek } from 'src/app/models/gameweek.model';
import { FixturesService } from 'src/app/services/fixtures.service';

@Component({
  selector: 'app-gameweek',
  templateUrl: './gameweek.component.html',
  styleUrls: ['./gameweek.component.css']
})
export class GameweekComponent implements OnInit, OnDestroy {

  @Input() mode: String;
  @Output() selectedGameweekChange = new EventEmitter<Gameweek>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  gameweek: Gameweek;
  selectedGameweekNumber: number;
  signal: boolean = true;
  fixturesUpdatedSub: Subscription;

  constructor(
    private fixturesService: FixturesService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fixturesUpdatedSub = this.fixturesService.fixturesUpdated.subscribe(
      () => {
        this.getSelectedGameweek();
      }
    );
  }

  ngOnDestroy() {
    this.fixturesUpdatedSub.unsubscribe();
  }

  getSelectedGameweek() {
    this.signal = false;
    this.fixturesService.getByOrderNumber(this.selectedGameweekNumber).subscribe(
      res => {
        this.gameweek = res;
        this.selectedGameweekChange.emit(this.gameweek);
        this.signal = true;
      },
      err => {
        this.signal = true;
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  onSelectedGameweekChange(selectedGameweekNumber: number) {
    this.selectedGameweekNumber = selectedGameweekNumber;
    this.getSelectedGameweek();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
