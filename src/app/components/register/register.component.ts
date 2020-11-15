import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Club } from 'src/app/models/club.model';
import { ClubService } from 'src/app/services/club.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() completedRegistration = new EventEmitter<any>();
  user: User;
  clubs: Club[] = [];
  selectedClub: number = null;

  constructor(
    private clubService: ClubService,
    private userService: UserService,
    private _snackBar: MatSnackBar 
  ) { }

  ngOnInit(): void {
    this.user = new User(null, null, null, null, null, null, "male", null, null, null);
    this.getClubs();
  }

  getClubs() {
    this.clubService.getAll().subscribe(
      res => {
        this.clubs = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  selectClub(index: number) {
    if(this.selectedClub == index) {
      this.selectedClub = null;
      return;
    }
    this.selectedClub = index;
  }

  register(stepper: MatStepper) {
    this.user.favouriteClubId = this.clubs[this.selectedClub].id;
    this.userService.register(this.user).subscribe(
      () => {
        this.openSnackBar("Registration completed!");
        stepper.reset();
        this.selectedClub = null;
        this.completedRegistration.emit();
      },
      err => {
        if(err.error.includes("USERNAME_ALREADY_EXISTS")) {
          stepper.selectedIndex = 0;
          this.openSnackBar("Error! Username is already taken!");
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
