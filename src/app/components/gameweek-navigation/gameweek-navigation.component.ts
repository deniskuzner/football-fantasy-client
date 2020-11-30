import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FixturesService } from 'src/app/services/fixtures.service';

@Component({
  selector: 'app-gameweek-navigation',
  templateUrl: './gameweek-navigation.component.html',
  styleUrls: ['./gameweek-navigation.component.css']
})
export class GameweekNavigationComponent implements OnInit, OnDestroy {

  @Output() selectedGameweekChange = new EventEmitter<number>();
  selectedGameweekNumber: number;
  gameweeksCount: number;
  fixturesUpdatedSub: Subscription;

  constructor(
    private fixturesService: FixturesService
  ) { }

  ngOnInit(): void {
    this.count();
    this.getCurrentGameweekNumber();
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
        this.gameweeksCount = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getCurrentGameweekNumber() {
    this.fixturesService.getCurrentGameweekNumber().subscribe(
      res => {
        this.selectedGameweekNumber = res;
        if(this.selectedGameweekNumber > 0) {
          this.selectedGameweekChange.emit(this.selectedGameweekNumber);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onPrevious() {
    this.selectedGameweekNumber--;
    this.selectedGameweekChange.emit(this.selectedGameweekNumber);
  }

  onNext() {
    this.selectedGameweekNumber++;
    this.selectedGameweekChange.emit(this.selectedGameweekNumber);
  }

}
