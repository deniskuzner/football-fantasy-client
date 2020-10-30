import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnInit {

  players: Player[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onPlayerAdded(player: Player) {
    console.log(player);

    // CELA LOGIKA ZA DODAVANJE IGRACA U TIM
    // SA KOMPLETNOM VALIDACIJOM PRE DODAVANJA
    
  }

}
