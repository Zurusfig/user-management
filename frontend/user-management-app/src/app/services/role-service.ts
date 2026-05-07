import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Role } from '../models/role.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiBaseUrl = environment.apiBaseUrl;

  getAllRoles() {
    return httpResource<ApiResponse<Role[]>>(() =>
      `${this.apiBaseUrl}/api/Roles`)
  }

}
