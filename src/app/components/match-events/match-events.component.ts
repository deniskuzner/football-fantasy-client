import { Component, OnInit, Input } from '@angular/core';
import { MatchEvent } from 'src/app/models/match-event.model';
import { Card } from 'src/app/models/card.model';
import { Match } from 'src/app/models/match.model';
import { Goal } from 'src/app/models/goal.model';

@Component({
  selector: 'app-match-events',
  templateUrl: './match-events.component.html',
  styleUrls: ['./match-events.component.css']
})
export class MatchEventsComponent implements OnInit {

  @Input() match: Match;
  events: MatchEvent[] = [];
  goalImg: String = "../../../assets/goal.png";
  ownGoalImg: String = "../../../assets/own_goal.png";
  yellowCardImg: String = "../../../assets/yellow_card.jpg";
  redCardImg: String = "../../../assets/red_card.png";
  substitutionImg: String = "../../../assets/substitution.png";

  constructor() { }

  ngOnInit(): void {
    this.events = this.match.events.filter(e => this.getType(e) != "MinutesPlayed");
  }

  getType(event: MatchEvent) {
    if (event.hasOwnProperty('minutesPlayed')) {
      return "MinutesPlayed";
    }
    if (event.hasOwnProperty('ownGoal')) {
      return "Goal";
    }
    if (event.hasOwnProperty('card')) {
      return "Card";
    }
    if (event.hasOwnProperty('inPlayer') && event.hasOwnProperty('outPlayer')) {
      return "Substitution";
    }
  }

  isHost(event: MatchEvent) {
    if (this.match.host.id == event.club.id) {
      return true;
    }
    return false;
  }

  isGuest(event: MatchEvent) {
    if (this.match.guest.id == event.club.id) {
      return true;
    }
    return false;
  }

  getGoalImg(event: Goal) {
    if(event.ownGoal) {
      return this.ownGoalImg;
    }
    return this.goalImg;
  }

  getCardImg(event: Card) {
    if(event.card == 'YELLOW') {
      return this.yellowCardImg;
    }
    return this.redCardImg;
  }

}
