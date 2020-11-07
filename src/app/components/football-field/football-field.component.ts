import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-football-field',
  templateUrl: './football-field.component.html',
  styleUrls: ['./football-field.component.css']
})
export class FootballFieldComponent implements OnInit {
  
  @Input() mode: String;
  goalkeeper: Player;
  defenders: Player[] = new Array(4);
  midfielders: Player[] = new Array(4);
  forwards: Player[] = new Array(2);
  bench: Player[] = new Array(4);

  constructor() { }

  ngOnInit(): void {
  }

}
