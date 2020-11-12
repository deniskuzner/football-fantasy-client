import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Player } from '../../models/player.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SelectPlayerDialogComponent } from '../dialogs/select-player-dialog/select-player-dialog.component';
import { PlayerService } from 'src/app/services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-selection-table',
  templateUrl: './player-selection-table.component.html',
  styleUrls: ['./player-selection-table.component.css']
})
export class PlayerSelectionTableComponent implements OnInit, OnDestroy {

  @Input() players: Player[] = [];
  @Input() position: String;
  @Output() playerAdded = new EventEmitter<Player>();
  dataSource: MatTableDataSource<Player>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['name', 'price', 'points'];
  filterChangedSub: Subscription;
  maxPriceChangedSub: Subscription;
  clubChangedSub: Subscription;
  sortChangedSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.setTableData(this.players);
    this.filterChangedSub = this.playerService.filterChanged.subscribe(
      res => {
        this.applyFilter(res);
      }
    );
    this.maxPriceChangedSub = this.playerService.maxPriceChanged.subscribe(
      res => {
        this.onMaxPriceChange(res);
      }
    );
    this.clubChangedSub = this.playerService.clubChanged.subscribe(
      res => {
        this.onClubChange(res);
      }
    );
    this.sortChangedSub = this.playerService.sortChanged.subscribe(
      res => {
        this.onSortChange(res);
      }
    );
  }

  ngOnDestroy() {
    this.filterChangedSub.unsubscribe();
    this.maxPriceChangedSub.unsubscribe();
    this.clubChangedSub.unsubscribe();
    this.sortChangedSub.unsubscribe();
  }

  setTableData(players: Player[]) {
    this.dataSource = new MatTableDataSource(players);
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

  getPlayerName(name: String): String {
    let lastName = name.split(' ')[1];
    if(!lastName) {
      return name;
    } else {
      return lastName;
    }
  }

  showPlayerDetails(player: Player) {
    const dialogRef = this.dialog.open(SelectPlayerDialogComponent, { data: { player: player } });
    dialogRef.afterClosed().subscribe(
      res => {
        if(res) {
          this.playerAdded.emit(player);
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onMaxPriceChange(maxPrice: number) {
    if(!maxPrice) {
      this.setTableData(this.players);
      return;
    }
    let players = this.players.filter(p => p.price <= maxPrice);
    this.setTableData(players);
  }

  onClubChange(club: String) {
    if(!club) {
      this.setTableData(this.players);
      return;
    }
    let players = this.players.filter(p => p.club.name == club);
    this.setTableData(players);
  }

  onSortChange(sort: string) {
    if(!sort) {
      this.setTableData(this.players);
      return;
    }
    let players = [...this.players].sort(this.compareValues(sort, 'desc'));
    this.setTableData(players);
  }

  compareValues(key: string, order: string) {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
  
      let varA =  a[key];
      let varB =  b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

}
