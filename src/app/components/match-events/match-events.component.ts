import { Component, OnInit, Input } from '@angular/core';
import { MatchEvent } from 'src/app/models/match-event.model';
import { Match } from 'src/app/models/match.model';

@Component({
  selector: 'app-match-events',
  templateUrl: './match-events.component.html',
  styleUrls: ['./match-events.component.css']
})
export class MatchEventsComponent implements OnInit {

  @Input() match: Match;
  events: MatchEvent[] = [];
  goalImg: String = "https://pngimg.com/uploads/football/football_PNG52733.png";
  yellowCardImg: String = "https://img.favpng.com/1/24/19/penalty-card-yellow-card-association-football-referee-png-favpng-qjyxZKn7W9qkggcEbht5tDMT4.jpg";
  redCardImg: String = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Red_card.svg/2000px-Red_card.svg.png";
  substitutionImg: String = "https://i.dlpng.com/static/png/4003604-football-substitute-icon-transparent-png-svg-vector-substitute-png-512_512_preview.webp";

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

  getCardImg(event: MatchEvent) {
    if(event.card == 'YELLOW') {
      return this.yellowCardImg;
    }
    return this.redCardImg;
  }

}
