import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Player } from '../../models/player.model';
import { Club } from '../../models/club.model';
import { PlayerService } from 'src/app/services/player.service';
import { ClubService } from 'src/app/services/club.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { EditPlayerDialogComponent } from '../dialogs/edit-player-dialog/edit-player-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit, OnDestroy {

  players: Player[] = [];
  playersData: Player[] = [];
  clubs: Club[] = [];
  displayedColumns: string[] = ['image', 'name', 'nationality', 'birthDate', 'age', 'playerPosition', 'height', 'weight', 'club'];
  dataSource: MatTableDataSource<Player>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  signal: boolean = true;
  private clubsUpdatedSub: Subscription;

  constructor(
    private playerService: PlayerService,
    private clubService: ClubService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllPlayers();
    this.getAllClubs();
    this.clubsUpdatedSub = this.clubService.clubsUpdated.subscribe(
      () => {
        this.getAllPlayers();
        this.getAllClubs();
      }
    );
  }

  ngOnDestroy() {
    this.clubsUpdatedSub.unsubscribe();
  }

  getAllPlayers() {
    this.playerService.getPlayers().subscribe(
      res => {
        this.players = res;
        this.playersData = res;
        this.setTableData(this.playersData);
      }
    );
  }

  setTableData(players: Player[]) {
    this.dataSource = new MatTableDataSource(players);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage();
  }

  getAllClubs() {
    this.clubService.getAll().subscribe(
      res => {
        this.clubs = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  parseSeasonPlayers() {
    this.signal = false;
    this.clubService.parseSeasonClubs().subscribe(
      () => {
        this.signal = true;
        this.getAllPlayers();
        this.getAllClubs();
        this.clubService.clubsUpdated.next(this.clubs);
        this.openSnackBar("Season players parsed successfully!");
      },
      err => {
        console.log(err);
        this.signal = true;
        this.openSnackBar("Error!");
      }
    );
  }

  deleteAllPlayers() {
    this.clubService.deleteAll().subscribe(
      () => {
        this.getAllPlayers();
        this.getAllClubs();
        this.clubService.clubsUpdated.next(this.clubs);
      },
      err => {
        console.log(err);
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

  filterByClub(eventValue) {
    if (eventValue == "all") {
      this.playersData = this.players;
    } else {
      this.playersData = this.players.filter(p => p.club.name == eventValue);
    }
    this.setTableData(this.playersData);
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
  
}
