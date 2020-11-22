import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FootballFieldMode } from 'src/app/constants/football-field-mode.enum';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { TeamService } from 'src/app/services/team.service';
import { FootballFieldPlayerDialogComponent } from '../dialogs/football-field-player-dialog/football-field-player-dialog.component';

@Component({
  selector: 'app-football-field-player',
  templateUrl: './football-field-player.component.html',
  styleUrls: ['./football-field-player.component.css']
})
export class FootballFieldPlayerComponent implements OnInit, OnDestroy {

  @Input() teamPlayer: TeamPlayer;
  @Input() mode: String;
  isSwitched: boolean = false;
  playerChangedSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.playerChangedSub = this.teamService.playerChanged.subscribe(
      res => {
        this.switchPlayer(res);
      }
    );
  }

  ngOnDestroy() {
    this.playerChangedSub.unsubscribe();
  }

  getImage(): String {
    if (!this.teamPlayer) {
      return "../../../assets/shirt.webp";
    } else {
      return '../../../assets/dres.png';
    }
  }

  getName(): String {
    if (!this.teamPlayer) {
      return "Select player";
    } else {
      let lastName = this.teamPlayer.player.name.split(' ')[1];
      if (!lastName) {
        return this.teamPlayer.player.name;
      } else {
        return lastName;
      }
    }
  }

  getBadge() {
    if (!this.teamPlayer || this.mode == FootballFieldMode.PICK_TEAM) {
      return null;
    } else if (this.mode == FootballFieldMode.POINTS) {
      return this.teamPlayer.points;
    } else if (this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return this.teamPlayer.player.price;
    }
  }

  getBadgePosition() {
    if (this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return "before";
    } else if (this.mode == FootballFieldMode.POINTS) {
      return "after";
    }
    return "after";
  }

  getBadgeColor() {
    if (this.mode == FootballFieldMode.TEAM_SELECTION || this.mode == FootballFieldMode.TRANSFERS) {
      return "primary";
    } else if (this.mode == FootballFieldMode.POINTS) {
      return "accent";
    }
  }

  onClick() {
    if (!this.teamPlayer) {
      return;
    }
    const dialogRef = this.dialog.open(FootballFieldPlayerDialogComponent, { data: { teamPlayer: this.teamPlayer, mode: this.mode } });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  switchPlayer(teamPlayer: TeamPlayer) {
    if(!teamPlayer) {
      this.isSwitched = false;
    } else if(this.teamPlayer.id == teamPlayer.id) {
      this.isSwitched = true;
    }
  }

}
