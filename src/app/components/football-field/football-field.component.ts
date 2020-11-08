import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-football-field',
  templateUrl: './football-field.component.html',
  styleUrls: ['./football-field.component.css']
})
export class FootballFieldComponent implements OnInit, OnDestroy {

  @Input() mode: String;
  goalkeeper: Player;
  defenders: Player[] = new Array(4);
  midfielders: Player[] = new Array(4);
  forwards: Player[] = new Array(2);
  bench: Player[] = new Array(4);

  playerAddedSub: Subscription;
  playerRemovedSub: Subscription;

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.playerAddedSub = this.teamService.playerAdded.subscribe(
      res => {
        this.addPlayer(res);
      }
    );
    this.playerRemovedSub = this.teamService.playerRemoved.subscribe(
      res => {
        this.removePlayer(res);
      }
    );
  }

  ngOnDestroy() {
    this.playerAddedSub.unsubscribe();
  }

  addPlayer(player: Player) {
    let position = player.position;
    if (position == "GK") {
      this.addGK(player);
    }
    if (position == "DF") {
      this.addDF(player);
    }
    if (position == "MF") {
      this.addMF(player);
    }
    if (position == "FW") {
      this.addFW(player);
    }
  }

  addGK(player: Player) {
    if (!this.goalkeeper) {
      this.goalkeeper = player;
    } else {
      this.bench[0] = player;
    }
  }

  addDF(player: Player) {
    for (let i = 0; i < this.defenders.length; i++) {
      if (!this.defenders[i]) {
        this.defenders[i] = player;
        return;
      }
    }
    this.bench[1] = player;
  }

  addMF(player: Player) {
    for (let i = 0; i < this.midfielders.length; i++) {
      if (!this.midfielders[i]) {
        this.midfielders[i] = player;
        return;
      }
    }
    this.bench[2] = player;
  }

  addFW(player: Player) {
    for (let i = 0; i < this.forwards.length; i++) {
      if (!this.forwards[i]) {
        this.forwards[i] = player;
        return;
      }
    }
    this.bench[3] = player;
  }

  removePlayer(player: Player) {
    console.log(player);
  }

}
