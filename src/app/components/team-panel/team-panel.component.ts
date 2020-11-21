import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscribable, Subscription } from 'rxjs';
import { Club } from 'src/app/models/club.model';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';
import { Team } from 'src/app/models/team.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClubService } from 'src/app/services/club.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit, OnDestroy {

  @Input() team: Team;
  @Output() captainChanged = new EventEmitter<{teamPlayer: TeamPlayer, type: String}>();
  teamPlayers: TeamPlayer[] = [];
  captain: TeamPlayer;
  viceCaptain: TeamPlayer;
  teamValue: number = 0;
  favouriteClub: Club;

  captainChangedSub: Subscription;
  teamResetSub: Subscription;

  constructor(
    private teamService: TeamService,
    private clubService: ClubService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getFavouriteClub();
    this.initTeam();
    this.captainChangedSub = this.teamService.captainChanged.subscribe(
      res => {
        this.changeCaptain(res);
      }
    );
    this.teamResetSub = this.teamService.teamReset.subscribe(
      () => {
        this.resetTeam();
      }
    );
  }

  ngOnDestroy() {
    this.captainChangedSub.unsubscribe();
  }

  getFavouriteClub() {
    this.clubService.getFavouriteClub(this.authService.getAuthData().id).subscribe(
      res => {
        this.favouriteClub = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  initTeam() {
    this.teamPlayers = [...this.team.teamPlayers];
    this.captain = this.teamPlayers.filter(tp => this.team.captainId == tp.player.id)[0];
    this.viceCaptain = this.teamPlayers.filter(tp => this.team.viceCaptainId == tp.player.id)[0];
    this.teamValue = Math.round(this.teamPlayers.reduce((a,b) => a + b.player.price, 0) * 10) / 10;
  }

  getPlayerImage(player: Player) {
    if (player.image.length) {
      return player.image;
    } else {
      return '../../../assets/person.png';
    }
  }

  changeCaptain(data: { player: Player; type: String }) {
    if (data.type == 'CAPTAIN') {
      if (this.captain.player.id == data.player.id) {
        return;
      }
      if(this.viceCaptain.player.id == data.player.id) {
        this.openSnackBar(data.player.name + ' is already Vice Captain!');
        return;
      }
      this.captain = this.teamPlayers.filter(tp => tp.player.id == data.player.id)[0];
      this.captainChanged.emit({teamPlayer: this.captain, type: 'CAPTAIN'});
    } else {
      if (this.viceCaptain.player.id == data.player.id) {
        return;
      }
      if(this.captain.player.id == data.player.id) {
        this.openSnackBar(data.player.name + ' is already Captain!');
        return;
      }
      this.viceCaptain = this.teamPlayers.filter(tp => tp.player.id == data.player.id)[0];
      this.captainChanged.emit({teamPlayer: this.viceCaptain, type: 'VICE_CAPTAIN'});
    }
  }

  resetTeam() {
    this.captain = this.teamPlayers.filter(tp => this.team.captainId == tp.player.id)[0];
    this.viceCaptain = this.teamPlayers.filter(tp => this.team.viceCaptainId == tp.player.id)[0];
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
