import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';

@Injectable()
export class PointsEffects {
  constructor(private actions$: Actions) {}
} 