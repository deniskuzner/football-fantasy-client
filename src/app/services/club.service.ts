import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../constants/app-constants';

@Injectable({
    providedIn: 'root'
})
export class ClubService {

    constructor(private http: HttpClient) {}

    parseSeasonClubs() {
        return this.http.get(AppConstants.serverUrl + '/clubs/parse-season-clubs');
    }

}