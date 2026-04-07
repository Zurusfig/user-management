import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserTable } from "../../components/user-table/user-table";
import { MatIconModule } from '@angular/material/icon';
import { Pagination } from '../../components/pagination/pagination';
import { UserService } from '../../services/user-service';
import { DataTableRequest } from '../../models/user.model';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-dashboard',
  imports: [UserTable, MatIconModule, Pagination, SearchBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private userService = inject(UserService);

  pageNumber = signal(1);
  pageSize = signal(6);
  totalCount = computed(() => this.userService.users()?.totalCount ?? 0);
  search = signal('');

  dataTableRequest = computed<DataTableRequest>(() => ({
    orderBy: undefined,
    orderDirection: undefined,
    pageNumber: this.pageNumber() - 1,
    pageSize: this.pageSize(),
    search: this.search(),
  }));

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers(this.dataTableRequest());
  }

  onPageChange(newPage: number) {
    this.pageNumber.set(newPage);
    this.fetchUsers();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.pageNumber.set(1);
    this.fetchUsers();
  }

  onSearch(query: string) {
    console.log('Search query:', query);
    this.pageNumber.set(1);
    this.search.set(query);
    this.fetchUsers();
  }

}
