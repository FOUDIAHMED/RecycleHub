import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestFormComponent } from './components/request-form/request-form.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { CollectorGuard } from '../../core/guards/collector.guard';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: RequestListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'new', 
    component: RequestFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: ':id', 
    component: RequestDetailComponent,
    canActivate: [AuthGuard, CollectorGuard]
  }
];

@NgModule({
  declarations: [
    RequestFormComponent,
    RequestListComponent,
    RequestDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CollectionRequestsModule { } 