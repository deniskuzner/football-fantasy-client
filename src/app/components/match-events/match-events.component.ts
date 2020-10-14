import { Component, OnInit, Input } from '@angular/core';
import { MatchEvent } from 'src/app/models/match-event.model';
import { Card } from 'src/app/models/card.model';
import { Match } from 'src/app/models/match.model';
import { Goal } from 'src/app/models/goal.model';
import { MatchEventService } from 'src/app/services/match-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  signal: boolean = true;

  constructor(private matchEventsService: MatchEventService, private _snackBar: MatSnackBar) { }

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

  getMatchEvents(url: string) {
    this.signal = false;
    this.matchEventsService.parseMatchEvents(url).subscribe(
      res => {
        this.events = res.filter(e => this.getType(e) != "MinutesPlayed");
        this.openSnackBar("Match events synchronized successfully!");
        this.signal = true;
      },
      err => {
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
