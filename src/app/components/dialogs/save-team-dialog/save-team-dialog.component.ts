import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-save-team-dialog',
  templateUrl: './save-team-dialog.component.html',
  styleUrls: ['./save-team-dialog.component.css']
})
export class SaveTeamDialogComponent implements OnInit {

  players: Player[] = [];
  captainOptions: Player[] = [];
  viceCaptainOptions: Player[] = [];
  captain: number;
  viceCaptain: number;
  name: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SaveTeamDialogComponent>
  ) { }

  ngOnInit(): void {
    this.players = this.data.players;
    this.captainOptions = this.players;
    this.viceCaptainOptions = this.players;
  }

  onCaptainChange() {
    this.viceCaptainOptions = this.players.filter(p => p.id != this.captain);
  }

  onViceCaptainChange() {
    this.captainOptions = this.players.filter(p => p.id != this.viceCaptain);
  }

  save(form: NgForm) {
    if(form.valid) {
      this.dialogRef.close({ data: {name: this.name, captain: this.captain, viceCaptain: this.viceCaptain} });
    }
  }

}
