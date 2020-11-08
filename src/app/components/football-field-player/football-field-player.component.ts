import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Player } from 'src/app/models/player.model';
import { FootballFieldPlayerDialogComponent } from '../dialogs/football-field-player-dialog/football-field-player-dialog.component';

@Component({
  selector: 'app-football-field-player',
  templateUrl: './football-field-player.component.html',
  styleUrls: ['./football-field-player.component.css']
})
export class FootballFieldPlayerComponent implements OnInit {

  @Input() player: Player;
  @Input() mode: String;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  getImage(): String {
    if (!this.player) {
      return "../../../assets/shirt.webp";
    } else {
      return '../../../assets/person.png';
    }
  }

  getName(): String {
    if (!this.player) {
      return "Select player";
    } else {
      return this.player.name.split(' ')[1];
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

  getBadgePosition() {
    if(this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return "before";
    } else if(this.mode == FootballFieldMode.POINTS) {
      return "after";
    }
  }

  getBadgeColor() {
    if(this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return "primary";
    } else if(this.mode == FootballFieldMode.POINTS) {
      return "accent";
    }
  }

  onClick() {
    if(!this.player) {
      return;
    }
    const dialogRef =this.dialog.open(FootballFieldPlayerDialogComponent, { data: {player: this.player, mode: this.mode} });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
