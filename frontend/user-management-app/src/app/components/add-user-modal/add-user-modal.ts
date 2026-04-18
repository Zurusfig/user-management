import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-user-modal',
  imports: [MatIconModule],
  templateUrl: './add-user-modal.html',
  styleUrl: './add-user-modal.scss',
})
export class AddUserModal {
  closeModal = output<void>();
}
