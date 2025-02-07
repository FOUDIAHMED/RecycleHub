import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightPipe } from './pipes/weight.pipe';

@NgModule({
  declarations: [WeightPipe],
  imports: [CommonModule],
  exports: [WeightPipe]
})
export class SharedModule { } 