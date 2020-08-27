import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Player } from '../../models/player.model';
import { Club } from '../../models/club.model';
import { PlayerService } from 'src/app/services/player.service';
import { ClubService } from 'src/app/services/club.service';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor(private playerService: PlayerService, private clubService: ClubService) {}

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
      }
    );
  }

  deleteAllPlayers() {
    this.clubService.deleteAll().subscribe(
      res => {
        this.getAllPlayers();
        this.getAllClubs();
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filter(eventValue) {
    if(eventValue == "all") {
      this.playersData = this.players;
    } else {
      this.playersData = this.players.filter(p => p.club.name == eventValue);
    }
    this.setTableData(this.playersData);
  }

}
