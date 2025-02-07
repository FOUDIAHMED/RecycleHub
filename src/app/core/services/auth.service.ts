import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { User } from '../models/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return from(this.storageService.getUserByEmail(email)).pipe(
      map(user => {
        if (!user) {
          throw new Error('User not found');
        }
        // In a real app, you would hash the password and compare with stored hash
        // For demo purposes, we're using plain text
        if (user.password !== password) {
          throw new Error('Invalid password');
        }
        return user;
      }),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(userData: Partial<User>): Observable<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      role: 'user',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: userData.password! // In real app, hash the password
    };

    return from(this.storageService.addUser(newUser));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isCollector(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'collector';
  }

  updateProfile(userId: string, userData: Partial<User>): Observable<User> {
    return from(this.storageService.getUser(userId)).pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not found');
        }
        const updatedUser = {
          ...user,
          ...userData,
          updatedAt: new Date()
        };
        return from(this.storageService.updateUser(updatedUser));
      }),
      tap(updatedUser => {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }
} 
