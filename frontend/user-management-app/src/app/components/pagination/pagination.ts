import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  pageNumber = input<number>(0);
  pageSize = input<number>(6);
  totalCount = input<number>(0);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  onNext() {
    this.pageChange.emit(this.pageNumber() + 1);
  }

  onPrev() {
    this.pageChange.emit(this.pageNumber() - 1);
  }

  onPageSizeChange(event: Event) {
    const size = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(size);
  }
}
