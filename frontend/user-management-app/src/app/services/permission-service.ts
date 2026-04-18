import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Permission } from '../models/permission.model';
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiBaseUrl = environment.apiBaseUrl;

  getAllPermissions() {
    return httpResource<Permission[]>(() =>
      `${this.apiBaseUrl}/api/Permissions`)
  }
  
}
