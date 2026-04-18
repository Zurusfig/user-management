import { Component, computed, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PermissionService } from '../../services/permission-service';
import { RoleService } from '../../services/role-service';

@Component({
  selector: 'app-add-user-modal',
  imports: [MatIconModule],
  templateUrl: './add-user-modal.html',
  styleUrl: './add-user-modal.scss',
})
export class AddUserModal {
  closeModal = output<void>();
  private roleService = inject(RoleService);
  private permissionService = inject(PermissionService);

  private getAllRolesRef = this.roleService.getAllRoles();
  private getAllPermissionsRef = this.permissionService.getAllPermissions();

  roleIsLoading = this.getAllRolesRef.isLoading;
  roleIsError = this.getAllRolesRef.error;
  roles = computed(() => this.getAllRolesRef.value()?.data ?? []);

  rolesDebug = computed(() => {
    console.log('roles loading:', this.getAllRolesRef.isLoading());
    console.log('roles error:', this.getAllRolesRef.error());
    console.log('roles value:', this.getAllRolesRef.value());
    return this.getAllRolesRef.value();
  });

  permissionIsLoading = this.getAllPermissionsRef.isLoading;
  permissionIsError = this.getAllPermissionsRef.error;
  permissions = this.getAllPermissionsRef.value;

}
