import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserModal } from './edit-user-modal';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('EditUserModal', () => {
  let component: EditUserModal;
  let fixture: ComponentFixture<EditUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserModal],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditUserModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
