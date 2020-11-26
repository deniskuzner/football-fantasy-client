import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Club } from 'src/app/models/club.model';
import { Player } from 'src/app/models/player.model';
import { ClubService } from 'src/app/services/club.service';
import { PlayerService } from 'src/app/services/player.service';
import { EditPlayerDialogComponent } from '../dialogs/edit-player-dialog/edit-player-dialog.component';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  clubId: number;
  club: Club;
  clubs: Club[] = [];
  players: Player[];
  displayedColumns: string[] = ['image', 'name', 'nationality', 'birthDate', 'age', 'playerPosition', 'height', 'weight', 'club'];
  dataSource: MatTableDataSource<Player>;
  signal: boolean = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private playerService: PlayerService,
    private clubService: ClubService,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.clubId = +this.activatedRoute.snapshot.paramMap.get("id");
    this.getPlayers();
    this.getClubs();
  }

  getPlayers() {
    this.signal = false;
    this.playerService.getClubPlayers(this.clubId).subscribe(
      res => {
        this.players = res;
        this.club = this.players[0].club;
        this.setTableData();
        this.signal = true;
      },
      err => {
        console.log(err);
        this.openSnackBar("Error!");
      }
    );
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showPlayerDetails(player: Player) {
    const dialogRef =this.dialog.open(EditPlayerDialogComponent, { data: {player: player, clubs: this.clubs} });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

  setTableData() {
    this.dataSource = new MatTableDataSource(this.players);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage();
  }

}
