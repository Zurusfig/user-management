import { Component } from '@angular/core';
import { UserTable } from "../../components/user-table/user-table";
import { MatIconModule } from '@angular/material/icon';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-dashboard',
  imports: [UserTable, MatIconModule, Pagination],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
