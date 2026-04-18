import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiBaseUrl = environment.apiBaseUrl;

  getAllRoles() {
    return httpResource<Role[]>(() =>
      `${this.apiBaseUrl}/api/Roles`)
  }

}
