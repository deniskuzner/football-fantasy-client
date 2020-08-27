import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Player } from '../../models/player.model';
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
  displayedColumns: string[] = ['id', 'image', 'name', 'nationality', 'birthDate', 'age', 'height', 'weight', 'club'];
  dataSource: MatTableDataSource<Player>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private playerService: PlayerService, private clubService: ClubService) {}

  ngOnInit(): void {
    this.getAllPlayers();
  }

  getAllPlayers() {
    this.playerService.getPlayers().subscribe(
      res => {
        this.players = res;
        this.dataSource = new MatTableDataSource(this.players);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res);
      }
    );
  }

  parseSeasonPlayers() {
    this.clubService.parseSeasonClubs().subscribe(
      res => {
        this.getAllPlayers();
        // POSLATI PORUKU USPESNOG IZVRSENJA
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

}
