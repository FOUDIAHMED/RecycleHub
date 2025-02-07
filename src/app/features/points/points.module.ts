import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { PointsHistoryComponent } from './components/points-summary/points-summary.component';
import { RewardsListComponent } from './components/rewards-list/rewards-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'history', pathMatch: 'full' },
  { path: 'history', component: PointsHistoryComponent },
  { path: 'rewards', component: RewardsListComponent }
];

@NgModule({
  declarations: [
    PointsHistoryComponent,
    RewardsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [DatePipe]
})
export class PointsModule { } 