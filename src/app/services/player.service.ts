import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppConstants } from '../constants/app-constants';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    constructor(private http: HttpClient) {}

    getPlayers() {
        return this.http.get<Player[]>(AppConstants.serverUrl + '/players/all');
    }

}