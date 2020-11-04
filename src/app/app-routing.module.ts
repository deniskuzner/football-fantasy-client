import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './components/players/players.component';
import { ClubsComponent } from './components/clubs/clubs.component';
import { PointsComponent } from './components/points/points.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HomeComponent } from './components/home/home.component';
import { FootballFieldComponent } from './components/football-field/football-field.component';
import { TeamSelectionComponent } from './components/team-selection/team-selection.component';
import { ClubComponent } from './components/club/club.component';


const routes: Routes = [
  {
    path : '',
    component: HomeComponent
  },
  {
    path: 'players',
    component: PlayersComponent
  },
  {
    path: 'clubs',
    component: ClubsComponent
  },
  {
    path: 'fixtures',
    component: FixturesComponent
  },
  {
    path: 'points',
    component: PointsComponent
  },
  {
    path: 'admin',
    component: AdminPanelComponent
  },
  {
    path: 'field',
    component: FootballFieldComponent
  },
  {
    path: 'team-selection',
    component: TeamSelectionComponent
  },
  {
    path: 'club/:id',
    component: ClubComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
