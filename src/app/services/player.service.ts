import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppConstants } from '../constants/app-constants';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

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

}