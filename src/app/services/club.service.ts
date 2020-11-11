import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConstants } from '../constants/app-constants';
import { Club } from '../models/club.model';

@Injectable({
    providedIn: 'root'
})
export class ClubService {

    clubsUpdated = new Subject<Club[]>();

    constructor(private http: HttpClient) {}

    parseSeasonClubs() {
        return this.http.get<Club[]>(AppConstants.serverUrl + '/clubs/parse-season-clubs');
    }

    getAll() {
        return this.http.get<Club[]>(AppConstants.serverUrl + '/clubs/all');
    }

    deleteAll() {
        return this.http.delete(AppConstants.serverUrl + '/clubs/all');
    }

    parseClub(url: String) {
        return this.http.post<Club>(AppConstants.serverUrl + '/clubs/parse', url);
    }

    deleteClub(id: number) {
        return this.http.delete(AppConstants.serverUrl + '/clubs/club/' + id);
    }

    getClubNames() {
        return this.http.get<String[]>(AppConstants.serverUrl + '/clubs/all/names');
    }

}