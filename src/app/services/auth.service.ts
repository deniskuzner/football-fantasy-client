import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { AppConstants } from '../constants/app-constants';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Team } from '../models/team.model';

export interface AuthData {
  id: number;
  teamId: number;
  // role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<AuthData>(this.getAuthData());

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }) {
    return this.http
      .post<User>(AppConstants.serverUrl + '/users/login', credentials)
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
    localStorage.removeItem('id');
    localStorage.removeItem('teamId');
    this.user.next(this.getAuthData());
  }

  //DODATI KASNIJE I ROLE
  getAuthData() {
    return {
      id: +localStorage.getItem('id'),
      teamId: +localStorage.getItem('teamId')
      // role: localStorage.getItem('role'),
    }
  }

  //DODATI KASNIJE I ROLE
  handleAuthData(user: User) {
    localStorage.setItem('id', String(user.id));
    if(user.team){
      localStorage.setItem('teamId', String(user.team.id));
    }
    //localStorage.setItem('role', user.role);
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

}
