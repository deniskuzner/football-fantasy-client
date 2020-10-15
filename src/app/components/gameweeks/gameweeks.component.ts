import { Component, Input, OnInit, OnChanges, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Gameweek } from 'src/app/models/gameweek.model';
import { Match } from 'src/app/models/match.model';

@Component({
  selector: 'app-gameweeks',
  templateUrl: './gameweeks.component.html',
  styleUrls: ['./gameweeks.component.css']
})
export class GameweeksComponent implements OnInit, OnChanges {

  @Input() gameweeks: Gameweek[];
  @Output() currentGameweekNumberChange = new EventEmitter<number>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  currentGameweekNumber: number = 1;
  currentGameweekMatches: Match[] = [];

  constructor() { }

  ngOnInit(): void {

  }
  
  ngOnChanges(): void {
    if(this.gameweeks.length > 0) {
      this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].matches;
    }
  }

  onPrevious() {
    this.currentGameweekNumber--;
    this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].matches;
    this.currentGameweekNumberChange.emit(this.currentGameweekNumber);
  }

  onNext() {
    this.currentGameweekNumber++;
    this.currentGameweekMatches = this.gameweeks.filter(g => g.orderNumber == this.currentGameweekNumber)[0].matches;
    this.currentGameweekNumberChange.emit(this.currentGameweekNumber);
  }

}
