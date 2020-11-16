import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    let credentials = {
      username: this.username,
      password: this.password
    };
    this.authService.login(credentials).subscribe(
      () => {
        this.router.navigate(['/team-selection']);
      },
      err => {
        console.log(err);
        if(err.error.includes('LOGIN_FAILED')) {
          this.openSnackBar('Invalid username or password!');
        } else {
          this.openSnackBar('Error!');
        }
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
