import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FixturesService } from 'src/app/services/fixtures.service';

@Component({
  selector: 'app-gameweek-navigation',
  templateUrl: './gameweek-navigation.component.html',
  styleUrls: ['./gameweek-navigation.component.css']
})
export class GameweekNavigationComponent implements OnInit {

  @Output() currentGameweekChange = new EventEmitter<number>();
  currentGameweekNumber: number = 1;
  gameweeksCount: number;

  constructor(
    private fixturesService: FixturesService
  ) { }

  ngOnInit(): void {
    this.count();
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

  onPrevious() {
    this.currentGameweekNumber--;
    this.currentGameweekChange.emit(this.currentGameweekNumber);
  }

  onNext() {
    this.currentGameweekNumber++;
    this.currentGameweekChange.emit(this.currentGameweekNumber);
  }

}
