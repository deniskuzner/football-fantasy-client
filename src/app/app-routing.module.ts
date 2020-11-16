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
import { AuthGuard } from './auth-guard.service';
import { LoggedInAuthGuard } from './logged-in-auth-guard.service';


const routes: Routes = [
  {
    path : '',
    component: HomeComponent,
    canActivate: [LoggedInAuthGuard]

  },
  {
    path: 'players',
    component: PlayersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clubs',
    component: ClubsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fixtures',
    component: FixturesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'points',
    component: PointsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'field',
    component: FootballFieldComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team-selection',
    component: TeamSelectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/club/:id',
    component: ClubComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
