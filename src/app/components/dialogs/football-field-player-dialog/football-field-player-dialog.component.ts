import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-football-field-player-dialog',
  templateUrl: './football-field-player-dialog.component.html',
  styleUrls: ['./football-field-player-dialog.component.css']
})
export class FootballFieldPlayerDialogComponent implements OnInit {

  teamPlayer: TeamPlayer;
  mode: String;
  title: String;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.teamPlayer = this.data.teamPlayer;
    this.mode = this.data.mode;
  }

  remove() {
    this.teamService.playerRemoved.next(this.teamPlayer);
  }

  switch() {
    this.teamService.playerSwitched.next(this.teamPlayer);
  }

  makeCaptain() {
    this.teamService.captainChanged.next({teamPlayer: this.teamPlayer, type: 'CAPTAIN'});
  }

  makeViceCaptain() {
    this.teamService.captainChanged.next({teamPlayer: this.teamPlayer, type: 'VICE_CAPTAIN'});
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

}
