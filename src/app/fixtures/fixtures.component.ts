import { Component, OnInit } from '@angular/core';
import { FixturesService } from '../services/fixtures.service';
import { Gameweek } from '../models/gameweek.model';
import { Match } from '../models/match.model';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.css']
})
export class FixturesComponent implements OnInit {

  gameweeks: Gameweek[] = [];
  currentGameweekNumber: number = 1;
  currentGameweekMatches: Match[] = [];
  

  constructor(private fixturesService: FixturesService) { }

  ngOnInit(): void {
    this.fixturesService.getAll().subscribe(
      res => {
        this.gameweeks = res;
        this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == 1)[0].matches;
      },
      err => {
        console.log(err);
      }
    );
  }

  syncFixtures() {
    this.fixturesService.parseSeasonFixtures().subscribe(
      res => {
        this.gameweeks = res;
        this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == 1)[0].matches;
      },
      err => {
        console.log(err);
      }
    );
  }

  previous() {
    this.currentGameweekNumber--;
    this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].matches;
  }

  next() {
    this.currentGameweekNumber++;
    this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].matches;
  }

}
