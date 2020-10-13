import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player.model';
import { NgForm } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';
import { Club } from 'src/app/models/club.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-player-dialog',
  templateUrl: './edit-player-dialog.component.html',
  styleUrls: ['./edit-player-dialog.component.css']
})
export class EditPlayerDialogComponent implements OnInit {

  public player: Player;
  public formPlayer: Player;
  public clubs: Club[] = [];
  public selectedClub: Number;
  public positions: String[] = ['GK', 'DF', 'MF', 'FW'];
  public selectedPosition: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playerService: PlayerService,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.player = this.data.player;
    this.clubs = this.data.clubs;
    this.formPlayer = {
      id: this.player.id,
      createdOn: this.player.createdOn,
      modifiedOn: this.player.modifiedOn,
      url: this.player.url,
      name: this.player.name,
      nationality: this.player.nationality,
      birthDate: this.player.birthDate,
      age: this.player.age,
      position: this.player.position,
      height: this.player.height,
      weight: this.player.weight,
      image: this.player.image,
      club: this.player.club
    }
    this.selectedClub = this.formPlayer.club.id;
    this.selectedPosition = this.formPlayer.position;
  }

  update(form: NgForm) {
    if (form.valid) {
      this.player.name = this.formPlayer.name;
      this.player.nationality = this.formPlayer.nationality;
      this.player.birthDate = this.formPlayer.birthDate;
      this.player.age = this.formPlayer.age;
      this.player.position = this.selectedPosition;
      this.player.height = this.formPlayer.height;
      this.player.weight = this.formPlayer.weight;
      this.player.image = this.formPlayer.image;
      this.player.club = this.clubs.filter(c => c.id == this.selectedClub)[0];

      this.playerService.updatePlayer(this.player).subscribe(
        () => {
          this.openSnackBar("Player is successfully updated!")
        },
        err => {
          console.log(err);
          this.openSnackBar("Error! Player is not updated!")
        }
      );
    } else {
      this.openSnackBar("Form is invalid! Please fill in all required fields.")
    }
  }

  delete() {
    this.playerService.deletePlayer(this.player.id).subscribe(
      () => {
        this.openSnackBar("Player is successfully deleted!")
      },
      err => {
        console.log(err);
        this.openSnackBar("Error! Player is not deleted!")
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "x", {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    });
  }

}
