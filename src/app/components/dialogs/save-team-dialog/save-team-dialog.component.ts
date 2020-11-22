import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player.model';
import { TeamPlayer } from 'src/app/models/team-player.model';

@Component({
  selector: 'app-save-team-dialog',
  templateUrl: './save-team-dialog.component.html',
  styleUrls: ['./save-team-dialog.component.css']
})
export class SaveTeamDialogComponent implements OnInit {

  teamPlayers: TeamPlayer[] = [];
  captainOptions: TeamPlayer[] = [];
  viceCaptainOptions: TeamPlayer[] = [];
  captain: number;
  viceCaptain: number;
  name: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SaveTeamDialogComponent>
  ) { }

  ngOnInit(): void {
    this.teamPlayers = this.data.teamPlayers;
    this.captainOptions = this.teamPlayers;
    this.viceCaptainOptions = this.teamPlayers;
  }

  onCaptainChange() {
    this.viceCaptainOptions = this.teamPlayers.filter(tp => tp.player.id != this.captain);
  }

  onViceCaptainChange() {
    this.captainOptions = this.teamPlayers.filter(tp => tp.player.id != this.viceCaptain);
  }

  save(form: NgForm) {
    if(form.valid) {
      this.dialogRef.close({ data: {name: this.name, captain: this.captain, viceCaptain: this.viceCaptain} });
    }
  }

}
