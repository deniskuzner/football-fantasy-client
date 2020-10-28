import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Player } from '../../models/player.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-player-selection-table',
  templateUrl: './player-selection-table.component.html',
  styleUrls: ['./player-selection-table.component.css']
})
export class PlayerSelectionTableComponent implements OnInit {

  @Input() players: Player[] = [];
  @Input() position: String;
  dataSource: MatTableDataSource<Player>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['name', 'price', 'points'];

  constructor() { }

  ngOnInit(): void {
    this.setTableData();
  }

  setTableData() {
    this.dataSource = new MatTableDataSource(this.players);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage();
  }

  getPlayerImage(playerImage: String): String {
    if (playerImage.length) {
      return playerImage;
    }
    return '../../../assets/person.png';
  }

  onPlayerClick(player: Player) {
    console.log(player);
  }

}
