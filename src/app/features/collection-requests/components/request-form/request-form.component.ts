import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';
import { AuthService } from '../../../../core/services/auth.service';
import { weightValidator } from '../../../../shared/validators/weight.validator.directive';

@Component({
  selector: 'app-request-form',
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Create Collection Request</h1>

      <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="wasteType" class="block text-sm font-medium text-gray-700">
            Type of Waste
          </label>
          <select
            id="wasteType"
            formControlName="wasteType"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
          >
            <option value="">Select a type</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
            <option value="metal">Metal</option>
            <option value="electronics">Electronics</option>
          </select>
          <p class="mt-2 text-sm text-red-600" *ngIf="requestForm.get('wasteType')?.errors?.['required'] && requestForm.get('wasteType')?.touched">
            Please select a waste type
          </p>
        </div>

        <div>
          <label for="weight" class="block text-sm font-medium text-gray-700">
            Estimated Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            formControlName="weight"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
          <p class="mt-2 text-sm text-red-600" *ngIf="requestForm.get('weight')?.errors?.['required'] && requestForm.get('weight')?.touched">
            Please enter the estimated weight
          </p>
          <p class="mt-2 text-sm text-red-600" *ngIf="requestForm.get('weight')?.errors?.['weight']">
            {{ requestForm.get('weight')?.errors?.['weight'] }}
          </p>
        </div>

        <div>
          <label for="pickupAddress" class="block text-sm font-medium text-gray-700">
            Pickup Address
          </label>
          <textarea
            id="pickupAddress"
            formControlName="pickupAddress"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          ></textarea>
          <p class="mt-2 text-sm text-red-600" *ngIf="requestForm.get('pickupAddress')?.errors?.['required'] && requestForm.get('pickupAddress')?.touched">
            Please enter the pickup address
          </p>
        </div>

        <div>
          <label for="pickupDate" class="block text-sm font-medium text-gray-700">
            Pickup Date
          </label>
          <input
            type="date"
            id="pickupDate"
            formControlName="pickupDate"
            [min]="minDate"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
          <p class="mt-2 text-sm text-red-600" *ngIf="requestForm.get('pickupDate')?.errors?.['required'] && requestForm.get('pickupDate')?.touched">
            Please select a pickup date
          </p>
        </div>

        <div>
          <label for="pickupTimeSlot" class="block text-sm font-medium text-gray-700">
            Preferred Time Slot
          </label>
          <select
            id="pickupTimeSlot"
            formControlName="pickupTimeSlot"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
          >
            <option value="">Select a time slot</option>
            <option value="morning">Morning (8:00 - 12:00)</option>
            <option value="afternoon">Afternoon (12:00 - 16:00)</option>
            <option value="evening">Evening (16:00 - 20:00)</option>
          </select>
          <p class="mt-2 text-sm text-red-600" *ngIf="requestForm.get('pickupTimeSlot')?.errors?.['required'] && requestForm.get('pickupTimeSlot')?.touched">
            Please select a time slot
          </p>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>

        <div class="text-sm text-red-600" *ngIf="error">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            routerLink="/requests"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="requestForm.invalid || isLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {{ isLoading ? 'Creating...' : 'Create Request' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class RequestFormComponent {
  requestForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  minDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.requestForm = this.formBuilder.group({
      wasteType: ['', Validators.required],
      weight: ['', [Validators.required, weightValidator]],
      pickupAddress: ['', Validators.required],
      pickupDate: ['', Validators.required],
      pickupTimeSlot: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      this.error = null;

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.error = 'You must be logged in to create a request';
        this.isLoading = false;
        return;
      }

      const request = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        status: 'pending',
        ...this.requestForm.value,
        pickupDate: new Date(this.requestForm.value.pickupDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.storageService.addRequest(request).then(
        () => {
          this.router.navigate(['/requests']);
        },
        (error) => {
          this.error = error.message;
          this.isLoading = false;
        }
      );
    }
  }
} 