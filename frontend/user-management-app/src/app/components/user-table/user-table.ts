import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user-service';
import { DataTableRequest } from '../../models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-table',
  imports: [MatIconModule, DatePipe],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTable {
  private userService = inject(UserService);

  isLoading = this.userService.isLoading;
  isError = this.userService.isError;
  userList = computed(() => this.userService.users()?.dataSource ?? []);

  onDelete(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId);
    }
  }
}
