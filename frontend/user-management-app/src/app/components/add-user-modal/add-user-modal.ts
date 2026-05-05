import { Component, computed, effect, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PermissionService } from '../../services/permission-service';
import { RoleService } from '../../services/role-service';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-add-user-modal',
  imports: [MatIconModule, ReactiveFormsModule],
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
  permissions = computed(() => this.getAllPermissionsRef.value()?.data ?? []);

  addUserFormGroup = new FormGroup({
    id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]
    }),
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
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    permissions: new FormArray([])
  }, { validators: passwordMatchValidator });

  permissionsArray = this.addUserFormGroup.get('permissions') as FormArray;

  constructor() {
    effect(() => {
      const perms = this.permissions();
      console.log('Permissions for form array:', perms);
      console.log('permissionsArray length:', this.permissionsArray.length);
      if (perms.length > 0 && this.permissionsArray.length === 0) {
        perms.forEach((perm) => {
          this.permissionsArray.push(new FormGroup({
            permissionId: new FormControl<string>(perm.permissionId, { nonNullable: true }),
            read: new FormControl<boolean>(false, { nonNullable: true }),
            write: new FormControl<boolean>(false, { nonNullable: true }),
            delete: new FormControl<boolean>(false, { nonNullable: true })
          }));
        });
      }
    }
    );
  }

  onSubmit() {
    this.addUserFormGroup.markAllAsTouched();

    if (this.addUserFormGroup.valid) {
      console.log('Form submitted!', this.addUserFormGroup.value);
    }
  }

  onlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}