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
  goalImg: String = "https://pngimg.com/uploads/football/football_PNG52733.png";
  ownGoalImg: String = "https://e1.365dm.com/score-centre/icons/own_goal.svg";
  yellowCardImg: String = "https://img.favpng.com/1/24/19/penalty-card-yellow-card-association-football-referee-png-favpng-qjyxZKn7W9qkggcEbht5tDMT4.jpg";
  redCardImg: String = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Red_card.svg/2000px-Red_card.svg.png";
  substitutionImg: String = "https://images.vexels.com/media/users/3/146860/isolated/preview/bbe607c0831621bfe4606d241ef04f8a-football-substitute-icon-by-vexels.png";

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
