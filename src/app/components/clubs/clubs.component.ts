import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { Club } from 'src/app/models/club.model';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {

  clubs: Club[] = [];
  displayedColumns: string[] = ['id', 'name', 'manager', 'image', 'action'];

  constructor(private clubService: ClubService) { }

  ngOnInit(): void {
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

  updateAll() {
    this.clubService.parseSeasonClubs().subscribe(
      res => {
        this.clubs = res;
        // POSLATI PORUKU USPESNOG IZVRSENJA
        // I UBACITI SPINER DOK SE NE IZVRSI
      },
      err => {
        console.log(err);
      }
    );
  }

  updateClub(url: String) {
    this.clubService.parseClub(url).subscribe(
      res => {
        this.getClubs();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteAll() {
    this.clubService.deleteAll().subscribe(
      res => {
        this.getClubs();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteClub(id: number) {
    this.clubService.deleteClub(id).subscribe(
      res => {
        this.getClubs();
      },
      err => {
        console.log(err);
      }
    );
  }

}
