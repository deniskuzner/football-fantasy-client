import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { Club } from 'src/app/models/club.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit, OnDestroy {

  clubs: Club[] = [];
  displayedColumns: string[] = ['id', 'name', 'image', 'action'];
  signal: boolean = true;
  updatingClubsIndexes: number[] = [];
  private clubsUpdatedSub: Subscription;

  constructor(
    private clubService: ClubService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getClubs();
    this.clubsUpdatedSub = this.clubService.clubsUpdated.subscribe(
      () => {
        this.getClubs();
      }
    );
  }
  
  ngOnDestroy() {
    this.clubsUpdatedSub.unsubscribe();
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
        this.openSnackBar("Error!");
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
        this.clubService.clubsUpdated.next(this.clubs);
      },
      err => {
        console.log(err);
        this.openSnackBar("Error! Clubs can't be updated!");
      }
    );
  }

  updateClub(url: String, updatedClubIndex: number) {
    this.updatingClubsIndexes.push(updatedClubIndex);
    this.clubService.parseClub(url).subscribe(
      res => {
        this.clubs.filter(c => c.url == url)[0] = res;
        this.removeIndex(updatedClubIndex);
        this.openSnackBar("Club updated successfully!");
      },
      err => {
        console.log(err);
        this.openSnackBar("Error! Club can't be updated!");
      }
    );
  }

  deleteAll() {
    this.clubService.deleteAll().subscribe(
      () => {
        this.getClubs();
        this.openSnackBar("Clubs deleted successfully!");
        this.clubService.clubsUpdated.next(this.clubs);
      },
      err => {
        console.log(err);
        this.openSnackBar("Error! Clubs can't be deleted!");
      }
    );
  }

  deleteClub(id: number) {
    this.clubService.deleteClub(id).subscribe(
      () => {
        this.getClubs();
        this.openSnackBar("Club deleted successfully!");
        this.clubService.clubsUpdated.next(this.clubs);
      },
      err => {
        console.log(err);
        this.openSnackBar("Error! Club can't be deleted!");
      }
    );
  }

  removeIndex(i: number) {
    let index = this.updatingClubsIndexes.indexOf(i);
    if (index > -1) {
      this.updatingClubsIndexes.splice(index, 1);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
