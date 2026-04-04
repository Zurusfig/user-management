import { Permission } from "./permission.model";
import { Role } from "./role.model";

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  userName: string;
  password: string;
  permissions: Permission[];
}

export interface UserCreateRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  userName: string;
  password: string;
  permissions: UserPermissionRequest[];
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  userName: string;
  permissions: UserPermissionRequest[];
}

export interface DataTableRequest {
  orderBy?: string;
  orderDirection?: string;
  pageNumber: number;
  pageSize: number;
  search?: string;
}

export interface UserPagedResponse {
  dataSource: UserListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface UserListItem {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  username: string;
  permissions: Permission[];
  createdDate: string;
}

export interface UserPermissionRequest {
  permissionId: string;
  isReadable: boolean;
  isWritable: boolean;
  isDeletable: boolean;
}