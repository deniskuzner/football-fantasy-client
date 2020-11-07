import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';

import { PlayerService } from './services/player.service';
import { ClubService } from './services/club.service';
import { FixturesService } from './services/fixtures.service';
import { PointsService } from './services/points.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PlayersComponent } from './components/players/players.component';
import { ClubsComponent } from './components/clubs/clubs.component';
import { EditPlayerDialogComponent } from './components/dialogs/edit-player-dialog/edit-player-dialog.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { MatchEventsComponent } from './components/match-events/match-events.component';
import { PointsComponent } from './components/points/points.component';
import { GameweekComponent } from './components/gameweek/gameweek.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HomeComponent } from './components/home/home.component';
import { FootballFieldComponent } from './components/football-field/football-field.component';
import { TeamSelectionComponent } from './components/team-selection/team-selection.component';
import { PlayerSelectionComponent } from './components/player-selection/player-selection.component';
import { PlayerSelectionTableComponent } from './components/player-selection-table/player-selection-table.component';
import { SelectPlayerDialogComponent } from './components/dialogs/select-player-dialog/select-player-dialog.component';
import { GameweekNavigationComponent } from './components/gameweek-navigation/gameweek-navigation.component';
import { ClubComponent } from './components/club/club.component';
import { FootballFieldPlayerComponent } from './components/football-field-player/football-field-player.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    HeaderComponent,
    ClubsComponent,
    EditPlayerDialogComponent,
    FixturesComponent,
    MatchEventsComponent,
    PointsComponent,
    GameweekComponent,
    AdminPanelComponent,
    HomeComponent,
    FootballFieldComponent,
    TeamSelectionComponent,
    PlayerSelectionComponent,
    PlayerSelectionTableComponent,
    SelectPlayerDialogComponent,
    GameweekNavigationComponent,
    ClubComponent,
    FootballFieldPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatDividerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCardModule,
    MatBadgeModule
  ],
  providers: [
    PlayerService,
    ClubService,
    FixturesService,
    PointsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
