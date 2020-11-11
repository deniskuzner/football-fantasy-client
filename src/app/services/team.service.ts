import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  playerAdded = new Subject<Player>();
  playerRemoved = new Subject<Player>();
  teamReset = new Subject<any>();

  constructor() { }
}
