import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './components/players/players.component';
import { ClubsComponent } from './components/clubs/clubs.component';
import { FixturesComponent } from './fixtures/fixtures.component';

const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
