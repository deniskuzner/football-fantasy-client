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
  
  maxPriceValues: number[] = [];
  selectedMaxPrice: number;
  clubNames: String[] = [];
  selectedClub: string;
  selectedSort: string;

  constructor(private playerService: PlayerService, private clubService: ClubService) { }

  ngOnInit(): void {
    this.getAllPlayers();
    this.getClubNames();
    this.initMaxPriceValues();
  }

  getAllPlayers() {
    this.signal = false;
    this.playerService.getPlayersOrderByPointsDesc().subscribe(
      res => {
        this.players = res;
        this.splitPlayersByPosition();
        this.signal = true;
      }
    );
  }

  getClubNames() {
    this.clubService.getClubNames().subscribe(
      res => {
        this.clubNames = res;
      },
      err => {
        console.log(err);
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

  applyFilter(event: Event) {
    this.playerService.filterChanged.next(event);
  }

  initMaxPriceValues() {
    for (let i = 3.5; i <= 15; i+=0.5) {
      this.maxPriceValues.push(i);
    }
  }

  onMaxPriceChange() {
    this.selectedSort = null;
    this.selectedClub = null;
    this.playerService.maxPriceChanged.next(this.selectedMaxPrice);
  }

  onClubChange() {
    this.selectedSort = null;
    this.selectedMaxPrice = null;
    this.playerService.clubChanged.next(this.selectedClub);
  }

  onSortChange() {
    this.selectedClub = null;
    this.selectedMaxPrice = null;
    this.playerService.sortChanged.next(this.selectedSort);
  }

}
