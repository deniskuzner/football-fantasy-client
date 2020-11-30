import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HomeComponent } from './components/home/home.component';
import { TeamSelectionComponent } from './components/team-selection/team-selection.component';
import { ClubComponent } from './components/club/club.component';
import { AuthGuard } from './guards/auth-guard.service';
import { LoggedInAuthGuard } from './guards/logged-in-auth-guard.service';
import { TeamGuard } from './guards/team-guard.service';
import { TeamPointsComponent } from './components/team-points/team-points.component';
import { PickTeamComponent } from './components/pick-team/pick-team.component';
import { TeamTransfersComponent } from './components/team-transfers/team-transfers.component';
import { LeaguesComponent } from './components/leagues/leagues.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TeamComponent } from './components/team/team.component';
import { AdminGuard } from './guards/admin-guard.service';


const routes: Routes = [
  {
    path : '',
    component: HomeComponent,
    canActivate: [LoggedInAuthGuard]

  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/club/:id',
    component: ClubComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team-selection',
    component: TeamSelectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team/:id',
    component: TeamComponent,
    canActivate: [AuthGuard, TeamGuard]
  },
  {
    path: 'team-points',
    component: TeamPointsComponent,
    canActivate: [AuthGuard, TeamGuard]
  },
  {
    path: 'pick-team',
    component: PickTeamComponent,
    canActivate: [AuthGuard, TeamGuard]
  },
  {
    path: 'team-transfers',
    component: TeamTransfersComponent,
    canActivate: [AuthGuard, TeamGuard]
  },
  {
    path: 'leagues',
    component: LeaguesComponent,
    canActivate: [AuthGuard, TeamGuard]
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
