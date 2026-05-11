import { Component, computed, effect, inject, input, output } from '@angular/core';
import { UserService } from '../../services/user-service';
import { RoleService } from '../../services/role-service';
import { PermissionService } from '../../services/permission-service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../add-user-modal/add-user-modal';
import { MatIcon } from '@angular/material/icon';
import { UserPermissionRequest } from '../../models/user.model';

@Component({
  selector: 'app-edit-user-modal',
  imports: [MatIcon, ReactiveFormsModule],
  templateUrl: './edit-user-modal.html',
  styleUrl: './edit-user-modal.scss',
})
export class EditUserModal {
  userId = input<string | null>(null);
  closeModal = output<void>();

  private roleService = inject(RoleService);
  private permissionService = inject(PermissionService);
  private userService = inject(UserService);

  private getUserRef = this.userService.getUserById(this.userId);
  private getAllRolesRef = this.roleService.getAllRoles();
  private getAllPermissionsRef = this.permissionService.getAllPermissions();

  userIsLoading = this.getUserRef.isLoading
  userIsError = this.getUserRef.error;
  user = computed(() => this.getUserRef.value()?.data);

  roleIsLoading = this.getAllRolesRef.isLoading;
  roleIsError = this.getAllRolesRef.error;
  roles = computed(() => this.getAllRolesRef.value()?.data ?? []);

  permissionIsLoading = this.getAllPermissionsRef.isLoading
  permissionIsError = this.getAllPermissionsRef.error;
  permissions = computed(() => this.getAllPermissionsRef.value()?.data ?? []);

  editUserFormGroup = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)]
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)]
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)]
    }),
    phone: new FormControl<string | null>(null, {
      validators: [Validators.pattern(/^[0-9]{10}$/)]
    }),
    roleId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    userName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)]
    }),
    permissions: new FormArray([])
  }, { validators: passwordMatchValidator });

  permissionsArray = this.editUserFormGroup.get('permissions') as FormArray;

  constructor() {
    effect(() => {
      const user = this.getUserRef.value()?.data;
      const perms = this.permissions();

      if (user) {
        this.editUserFormGroup.patchValue({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          roleId: user.roleId,
          userName: user.userName,
        });
      }
      if (perms.length > 0 && this.permissionsArray.length === 0) {
        perms.forEach((perm) => {
          this.permissionsArray.push(new FormGroup({
            permissionId: new FormControl<string>(perm.permissionId, { nonNullable: true }),
            isReadable: new FormControl<boolean>(false, { nonNullable: true }),
            isWritable: new FormControl<boolean>(false, { nonNullable: true }),
            isDeletable: new FormControl<boolean>(false, { nonNullable: true })
          }));
        });
      }

      if (user && this.permissionsArray.length > 0) {
        perms.forEach((perm, i) => {
          const userPerm = user.permissions.find(
            p => p.permissionId === perm.permissionId
          ) as UserPermissionRequest;
          if (userPerm) {
            this.permissionsArray.at(i).patchValue({
              isReadable: userPerm.isReadable,
              isWritable: userPerm.isWritable,
              isDeletable: userPerm.isDeletable
            });
          }
        });
      }
    })
  }

  onSubmit() {
    this.editUserFormGroup.markAllAsTouched();

    if (this.editUserFormGroup.valid) {
      console.log('Form Value:', this.editUserFormGroup.getRawValue());
    }
  }

  onlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }


}
