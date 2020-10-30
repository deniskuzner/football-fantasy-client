import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { ClubService } from 'src/app/services/club.service';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.css']
})
export class PlayerSelectionComponent implements OnInit {

  @Output() playerAdded = new EventEmitter<Player>();
  players: Player[] = [];
  goalkeepers: Player[] = [];
  defenders: Player[] = [];
  midfielders: Player[] = [];
  forwards: Player[] = [];
  signal: boolean = true;

  constructor(private playerService: PlayerService, private clubService: ClubService) { }

  ngOnInit(): void {
    this.getAllPlayers();
  }

  getAllPlayers() {
    this.signal = false;
    this.playerService.getPlayers().subscribe(
      res => {
        this.players = res;
        this.splitPlayersByPosition();
        this.signal = true;
      }
    );
  }

  splitPlayersByPosition() {
    this.goalkeepers = this.players.filter(p => p.position == "GK" );
    this.defenders = this.players.filter(p => p.position == "DF" );
    this.midfielders = this.players.filter(p => p.position == "MF" );
    this.forwards = this.players.filter(p => p.position == "FW" );
  }

  onPlayerAdded(player: Player) {
    this.playerAdded.emit(player);
  }

}
