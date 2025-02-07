import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight'
})
export class WeightPipe implements PipeTransform {
  transform(value: number, unit: 'kg' | 'g' = 'kg'): string {
    if (unit === 'kg') {
      return `${value.toFixed(2)} kg`;
    } else {
      return `${(value * 1000).toFixed(0)} g`;
    }
  }
} 