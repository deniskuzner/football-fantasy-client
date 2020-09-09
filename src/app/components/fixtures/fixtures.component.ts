import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { FixturesService } from '../../services/fixtures.service';
import { MatchEventService } from '../../services/match-event.service';
import { Gameweek } from '../../models/gameweek.model';
import { Match } from '../../models/match.model';
import { MatchEvent } from '../../models/match-event.model';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.css']
})
export class FixturesComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  gameweeks: Gameweek[] = [];
  currentGameweekNumber: number = 1;
  currentGameweekMatches: Match[] = [];
  matchEvents: MatchEvent[] = [];

  constructor(private fixturesService: FixturesService, private matchEventService: MatchEventService) { }

  ngOnInit(): void {
    this.getFixtures();
  }

  getFixtures() {
    this.fixturesService.getAll().subscribe(
      res => {
        this.gameweeks = res;
        if (this.gameweeks.length > 0) {
          this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == 1)[0].matches;
        }
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

  syncGameweekMatchEvents() {
    let currentGameweekId = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].id;
    this.matchEventService.parseGameweekMatchEvents(currentGameweekId).subscribe(
      res => {
        this.getFixtures();
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
