import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { DataTableRequest } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { UserPagedResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  users = signal<UserPagedResponse | null>(null);

  isLoading = signal(false);
  isError = signal(false);

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
}
