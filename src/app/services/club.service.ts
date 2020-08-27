import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../constants/app-constants';
import { Club } from '../models/club.model';

@Injectable({
    providedIn: 'root'
})
export class ClubService {

    constructor(private http: HttpClient) {}

    parseSeasonClubs() {
        return this.http.get(AppConstants.serverUrl + '/clubs/parse-season-clubs');
    }

    getAll() {
        return this.http.get<Club[]>(AppConstants.serverUrl + '/clubs/all');
    }

    deleteAll() {
        return this.http.delete(AppConstants.serverUrl + '/clubs/all');
    }

}