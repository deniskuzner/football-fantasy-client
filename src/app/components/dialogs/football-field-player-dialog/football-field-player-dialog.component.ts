import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player.model';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-football-field-player-dialog',
  templateUrl: './football-field-player-dialog.component.html',
  styleUrls: ['./football-field-player-dialog.component.css']
})
export class FootballFieldPlayerDialogComponent implements OnInit {

  player: Player;
  mode: String;
  title: String;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.player = this.data.player;
    this.mode = this.data.mode;
  }

  remove() {
    this.teamService.playerRemoved.next(this.player);
  }

  switch() {
    this.teamService.playerSwitched.next(this.player);
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

}
