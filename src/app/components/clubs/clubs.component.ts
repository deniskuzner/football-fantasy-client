import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { Club } from 'src/app/models/club.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {

  clubs: Club[] = [];
  displayedColumns: string[] = ['id', 'name', 'image', 'action'];
  signal: boolean = true;

  constructor(
    private clubService: ClubService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.getClubs();
  }

  getClubs() {
    this.signal = false;
    this.clubService.getAll().subscribe(
      res => {
        this.clubs = res;
        this.signal = true;
      },
      err => {
        console.log(err);
        this.signal = true;
      }
    );
  }

  updateAll() {
    this.signal = false;
    this.clubService.parseSeasonClubs().subscribe(
      res => {
        this.clubs = res;
        this.signal = true;
        this.openSnackBar("Clubs updated successfully!");
      },
      err => {
        console.log(err);
      }
    );
  }

  updateClub(url: String) {
    this.signal = false;
    this.clubService.parseClub(url).subscribe(
      () => {
        this.getClubs();
        this.signal = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteAll() {
    this.clubService.deleteAll().subscribe(
      () => {
        this.getClubs();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteClub(id: number) {
    this.clubService.deleteClub(id).subscribe(
      () => {
        this.getClubs();
      },
      err => {
        console.log(err);
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
