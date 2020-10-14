import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './components/players/players.component';
import { ClubsComponent } from './components/clubs/clubs.component';
import { PointsComponent } from './components/points/points.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HomeComponent } from './components/home/home.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
