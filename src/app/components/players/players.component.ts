import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Player } from '../../models/player.model';
import { Club } from '../../models/club.model';
import { PlayerService } from 'src/app/services/player.service';
import { ClubService } from 'src/app/services/club.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditPlayerDialogComponent } from '../dialogs/edit-player-dialog/edit-player-dialog.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  players: Player[] = [];
  playersData: Player[] = [];
  clubs: Club[] = [];
  displayedColumns: string[] = ['id', 'image', 'name', 'nationality', 'birthDate', 'age', 'height', 'weight', 'club'];
  dataSource: MatTableDataSource<Player>;

  allComplete: boolean = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private playerService: PlayerService,
    private clubService: ClubService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllPlayers();
    this.getAllClubs();
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
        // UBACITI SPINER DOK SE NE IZVRSI
      },
      err => {
        console.log(err);
      }
    );
  }

  parseSeasonPlayers() {
    this.clubService.parseSeasonClubs().subscribe(
      res => {
        this.getAllPlayers();
        this.getAllClubs();
        // POSLATI PORUKU USPESNOG IZVRSENJA
        // I UBACITI SPINER DOK SE NE IZVRSI
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteAllPlayers() {
    this.clubService.deleteAll().subscribe(
      res => {
        this.getAllPlayers();
        this.getAllClubs();
      },
      err => {
        console.log(err);
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
      this.getAllPlayers();
    });
  }

}
