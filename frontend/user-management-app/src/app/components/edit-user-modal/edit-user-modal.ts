import { Component, inject, input, output } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-edit-user-modal',
  imports: [],
  templateUrl: './edit-user-modal.html',
  styleUrl: './edit-user-modal.scss',
})
export class EditUserModal {
  userId = input<string | null>(null);
  closeModal = output<void>();

  private userService = inject(UserService);
  
  userRef = this.userService.getUserById(this.userId);

}
