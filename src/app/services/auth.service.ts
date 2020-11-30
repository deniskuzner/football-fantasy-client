import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { AppConstants } from '../constants/app-constants';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Team } from '../models/team.model';

export interface AuthData {
  token: string;
  id: number;
  teamId: number;
  roles: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<AuthData>(this.getAuthData());

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }) {
    return this.http
      .post(AppConstants.serverUrl + '/login', credentials, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), 
        observe: 'response'
      })
      .pipe(
        tap(
          res => {
            this.handleAuthData(res);
            this.user.next(this.getAuthData());
          }
        )
      );
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('teamId');
    localStorage.removeItem('roles');
    this.user.next(this.getAuthData());
  }

  getAuthData() {
    return {
      token: localStorage.getItem('token'),
      id: +localStorage.getItem('id'),
      teamId: +localStorage.getItem('teamId'),
      roles: localStorage.getItem('roles')
    }
  }

  handleAuthData(res) {
    const token = res.headers.get('authorization');
    localStorage.setItem('token', token);
    localStorage.setItem('id', String(res.body.userId));
    if(res.body.teamId){
      localStorage.setItem('teamId', String(res.body.teamId));
    }
    localStorage.setItem('roles', res.body.roles);
  }

  setTeam(team: Team) {
    localStorage.setItem('teamId', String(team.id));
    this.user.next(this.getAuthData());
  }

  isAuthenticated() {
    return !!localStorage.getItem('id');
  }

  isTeamCreated() {
    return !!localStorage.getItem('teamId');
  }

  isAdmin() {
    let roles = localStorage.getItem('roles');
    if(!roles) {
      return false;
    } else {
      if(roles.split(',').includes('ADMIN')) {
        return true;
      } else {
        return false;
      }
    }
  }

}
