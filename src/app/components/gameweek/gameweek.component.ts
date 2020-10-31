import { Component, OnInit, Output, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
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

  @Output() currentGameweekChange = new EventEmitter<Gameweek>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  gameweek: Gameweek;
  currentGameweekNumber: number = 1;
  gameweeksCount: number;
  signal: boolean = true;
  private fixturesChangedSub: Subscription;

  constructor(
    private fixturesService: FixturesService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.count();
    this.getCurrentGameweek();
    this.fixturesChangedSub = this.fixturesService.fixturesUpdated.subscribe(
      () => {
        this.getCurrentGameweek();
      }
    );
  }

  
  ngOnDestroy() {
    this.fixturesChangedSub.unsubscribe();
  }

  count() {
    this.fixturesService.count().subscribe(
      res => {
        this.gameweeksCount = res;
      },
      err => {
        console.log(err);
      }
    );
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
  
  onPrevious() {
    this.currentGameweekNumber--;
    this.getCurrentGameweek();
    this.currentGameweekChange.emit(this.gameweek);
  }

  onNext() {
    this.currentGameweekNumber++;
    this.getCurrentGameweek();
    this.currentGameweekChange.emit(this.gameweek);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
