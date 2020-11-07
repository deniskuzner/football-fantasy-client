import { Component, Input, OnInit } from '@angular/core';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-football-field-player',
  templateUrl: './football-field-player.component.html',
  styleUrls: ['./football-field-player.component.css']
})
export class FootballFieldPlayerComponent implements OnInit {

  @Input() player: Player;
  @Input() mode: String;

  constructor() { }

  ngOnInit(): void {

  }

  getImage(): String {
    if (!this.player) {
      return "../../../assets/shirt.webp";
    } else if (this.player.image.length) {
      return this.player.image;
    } else {
      return '../../../assets/person.png';
    }
  }

  getName(): String {
    if (!this.player) {
      return "Select player";
    } else {
      return this.player.name;
    }
  }

  getBadge() {
    if (!this.player || this.mode == FootballFieldMode.PICK_TEAM ) {
      return null;
    } else if (this.mode == FootballFieldMode.POINTS) {
      return this.player.playerGameweekPerformances[this.player.playerGameweekPerformances.length -1];
    } else if (this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return this.player.price;
    }
  }

  onClick() {

  }

}
