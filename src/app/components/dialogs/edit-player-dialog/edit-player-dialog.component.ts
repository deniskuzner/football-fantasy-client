import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from 'src/app/models/player.model';
import { NgForm, FormControl } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';
import { Club } from 'src/app/models/club.model';




import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



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



  public positions: String[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredPositions: Observable<string[]>;
  positionCtrl = new FormControl();
  allPositions: string[] = ['GK', 'DF', 'MF', 'FW'];
  @ViewChild('positionInput') positionInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private playerService: PlayerService) {
    this.filteredPositions = this.positionCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allPositions.slice()));
  }

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
    this.positions = this.formPlayer.position.split(',');
  }

  update(form: NgForm) {
    if (form.valid) {
      this.player.name = this.formPlayer.name;
      this.player.nationality = this.formPlayer.nationality;
      this.player.birthDate = this.formPlayer.birthDate;
      this.player.age = this.formPlayer.age;
      this.player.position = this.positions.join();
      this.player.height = this.formPlayer.height;
      this.player.weight = this.formPlayer.weight;
      this.player.image = this.formPlayer.image;
      this.player.club = this.clubs.filter(c => c.id == this.selectedClub)[0];

      this.playerService.updatePlayer(this.player).subscribe(
        res => {
          // UBACITI MODAL SA PORUKOM
        },
        err => {
          console.log(err);
          // UBACITI MODAL SA PORUKOM GRESKE
        }
      );
    }

    //URADITI ELSE AKO FORMA NIJE VALIDNA
  }

  delete() {
    this.playerService.deletePlayer(this.player.id).subscribe(
      res => {
        // UBACITI MODAL SA PORUKOM
      },
      err => {
        // UBACITI MODAL SA PORUKOM GRESKE
      }
    );
  }









  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.positions.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  remove(position: String): void {
    const index = this.positions.indexOf(position);

    if (index >= 0) {
      this.positions.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.positions.includes(event.option.viewValue)) {
      this.positions.push(event.option.viewValue);
    }
    this.positionInput.nativeElement.value = '';
    this.positionCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allPositions.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }





}
