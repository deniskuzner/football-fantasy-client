import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AppConstants } from '../constants/app-constants';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    filterChanged = new Subject<Event>();
    maxPriceChanged = new Subject<number>();
    clubChanged = new Subject<string>();
    sortChanged = new Subject<string>();

    constructor(private http: HttpClient) { }

    getPlayers() {
        return this.http.get<Player[]>(AppConstants.serverUrl + '/players/all');
    }

    updatePlayer(player: Player) {
        return this.http.post(AppConstants.serverUrl + '/players/player', player);
    }

    deletePlayer(id: Number) {
        return this.http.delete(AppConstants.serverUrl + '/players/player/' + id);
    }

    getPlayersOrderByPointsDesc() {
        return this.http.get<Player[]>(AppConstants.serverUrl + '/players/all/points-desc');
    }

    getClubPlayers(clubId: number) {
        return this.http.get<Player[]>(AppConstants.serverUrl + '/players/club/' + clubId);
    }

}