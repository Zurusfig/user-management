import { inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { DataTableRequest, UserCreateRequest, UserResponse } from '../models/user.model';
import { UserPagedResponse } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  users = signal<UserPagedResponse | null>(null);

  isLoading = signal(false);
  isError = signal(false);
  isCreating = signal(false);
  isCreateError = signal(false);
  createSuccess = signal(false);
  deleteSuccess = signal(false);

  getUsers(request: DataTableRequest) {
    console.log('Fetching users with request:', request);
    this.isLoading.set(true);
    this.http.post<UserPagedResponse>(
      `${this.apiBaseUrl}/api/User/DataTable`, request
    ).subscribe({
      next: (response) => {
        console.log(response);
        this.users.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  createUser(request: UserCreateRequest) {
    console.log('Creating user with request:', request);
    this.isCreating.set(true);
    this.isCreateError.set(false);
    this.http.post<ApiResponse<UserResponse>>(`${this.apiBaseUrl}/api/User`, request).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.createSuccess.set(true);
      },
      error: () => {
        this.isCreateError.set(true);
        this.isCreating.set(false);
      }
    });
  }

  deleteUser(userId: string) {
    this.isLoading.set(true);
    this.isError.set(false);
    this.http.delete<ApiResponse<string>>(`${this.apiBaseUrl}/api/User/${userId}`).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.deleteSuccess.set(true);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  getUserById(userId: Signal<string | null>) {
    return httpResource<ApiResponse<UserResponse>>(() =>
      userId() ? `${this.apiBaseUrl}/api/User/${userId()}` : undefined
    );
  }
}
