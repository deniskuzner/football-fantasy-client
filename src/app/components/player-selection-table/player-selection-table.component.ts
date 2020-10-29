import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Player } from '../../models/player.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SelectPlayerDialogComponent } from '../dialogs/select-player-dialog/select-player-dialog.component';

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

  constructor(
    public dialog: MatDialog
  ) { }

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

  showPlayerDetails(player: Player) {
    this.dialog.open(SelectPlayerDialogComponent, { data: { player: player } });
  }

}
