import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authData: AuthData;
  userSub: Subscription;
  roles: String[];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      res => {
        this.authData = res;
        this.setRoles();
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  setRoles() {
    if(!this.authData.roles) {
      this.roles = [];
    } else {
      this.roles = this.authData.roles.split(',');
    }
  }

  isAdmin() {
    if(this.roles.includes('ADMIN')) {
      return true;
    }
    return false;
  }

}
