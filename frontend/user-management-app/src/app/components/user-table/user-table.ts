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
export class UserTable implements OnInit{
  private dataTableService = inject(UserService);

  // Place holder for Pagination
  orderBy = null;
  orderDirection = null;
  pageNumber = 1;
  pageSize = 1;
  search = null;
  dataTableRequest: DataTableRequest = {
  orderBy: undefined,
  orderDirection: undefined,
  pageNumber: 1,
  pageSize: 1,
  search: undefined
};

  ngOnInit() {
    this.dataTableService.getUsers(this.dataTableRequest);
  }

  isLoading = this.dataTableService.isLoading;
  isError = this.dataTableService.isError;
  userList = computed(() => this.dataTableService.users()?.dataSource ?? []);
}
