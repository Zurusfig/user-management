import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  imports: [MatIconModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  searchChanged = output<string>();

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
  }
}
