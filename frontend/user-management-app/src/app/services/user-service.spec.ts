import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user-service';
import { environment } from '../../environments/environment';
import { UserCreateRequest, UserUpdateRequest, DataTableRequest } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiBaseUrl;

  const mockDataTableRequest: DataTableRequest = {
    pageNumber: 1,
    pageSize: 6,
    orderBy: undefined,
    orderDirection: undefined,
    search: undefined
  };

  const mockPagedResponse = {
    dataSource: [
      {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: { roleId: 'ROLE_ADMIN', roleName: 'Admin' },
        username: 'johndoe',
        permissions: [],
        createdDate: '2024-01-01'
      }
    ],
    page: 1,
    pageSize: 6,
    totalCount: 1
  };

  const mockCreateRequest: UserCreateRequest = {
    id: '99',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    roleId: 'ROLE_ADMIN',
    userName: 'testuser',
    password: 'password123',
    permissions: []
  };

  const mockUpdateRequest: UserUpdateRequest = {
    firstName: 'Updated',
    lastName: 'User',
    email: 'updated@example.com',
    roleId: 'ROLE_ADMIN',
    userName: 'updateduser',
    permissions: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensures no outstanding requests
  });

  // ── Initial State ──────────────────────────────────────────
  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have null users initially', () => {
      expect(service.users()).toBeNull();
    });

    it('should have isLoading false initially', () => {
      expect(service.isLoading()).toBeFalse();
    });

    it('should have isError false initially', () => {
      expect(service.isError()).toBeFalse();
    });

    it('should have createSuccess false initially', () => {
      expect(service.createSuccess()).toBeFalse();
    });

    it('should have deleteSuccess false initially', () => {
      expect(service.deleteSuccess()).toBeFalse();
    });

    it('should have updateSuccess false initially', () => {
      expect(service.updateSuccess()).toBeFalse();
    });
  });

  // ── getUsers ───────────────────────────────────────────────
  describe('getUsers()', () => {
    it('should set isLoading to true while fetching', () => {
      service.getUsers(mockDataTableRequest);
      expect(service.isLoading()).toBeTrue();
      httpMock.expectOne(`${apiUrl}/api/User/DataTable`).flush(mockPagedResponse);
    });

    it('should set users signal on success', () => {
      service.getUsers(mockDataTableRequest);
      httpMock.expectOne(`${apiUrl}/api/User/DataTable`).flush(mockPagedResponse);
      expect(service.users()).toEqual(mockPagedResponse);
    });

    it('should set isLoading to false on success', () => {
      service.getUsers(mockDataTableRequest);
      httpMock.expectOne(`${apiUrl}/api/User/DataTable`).flush(mockPagedResponse);
      expect(service.isLoading()).toBeFalse();
    });

    it('should set isError to true on failure', () => {
      service.getUsers(mockDataTableRequest);
      httpMock.expectOne(`${apiUrl}/api/User/DataTable`)
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.isError()).toBeTrue();
    });

    it('should set isLoading to false on failure', () => {
      service.getUsers(mockDataTableRequest);
      httpMock.expectOne(`${apiUrl}/api/User/DataTable`)
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.isLoading()).toBeFalse();
    });
  });

  // ── createUser ─────────────────────────────────────────────
  describe('createUser()', () => {
    it('should set isCreating to true while creating', () => {
      service.createUser(mockCreateRequest);
      expect(service.isCreating()).toBeTrue();
      httpMock.expectOne(`${apiUrl}/api/User`).flush({});
    });

    it('should set createSuccess to true on success', () => {
      service.createUser(mockCreateRequest);
      httpMock.expectOne(`${apiUrl}/api/User`).flush({});
      expect(service.createSuccess()).toBeTrue();
    });

    it('should set isCreating to false on success', () => {
      service.createUser(mockCreateRequest);
      httpMock.expectOne(`${apiUrl}/api/User`).flush({});
      expect(service.isCreating()).toBeFalse();
    });

    it('should set isCreateError to true on failure', () => {
      service.createUser(mockCreateRequest);
      httpMock.expectOne(`${apiUrl}/api/User`)
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.isCreateError()).toBeTrue();
    });

    it('should POST to correct endpoint', () => {
      service.createUser(mockCreateRequest);
      const req = httpMock.expectOne(`${apiUrl}/api/User`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  // ── deleteUser ─────────────────────────────────────────────
  describe('deleteUser()', () => {
    it('should set deleteSuccess to true on success', () => {
      service.deleteUser('1');
      httpMock.expectOne(`${apiUrl}/api/User/1`).flush({});
      expect(service.deleteSuccess()).toBeTrue();
    });

    it('should set isLoading to false on success', () => {
      service.deleteUser('1');
      httpMock.expectOne(`${apiUrl}/api/User/1`).flush({});
      expect(service.isLoading()).toBeFalse();
    });

    it('should DELETE to correct endpoint', () => {
      service.deleteUser('1');
      const req = httpMock.expectOne(`${apiUrl}/api/User/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should set isError to true on failure', () => {
      service.deleteUser('1');
      httpMock.expectOne(`${apiUrl}/api/User/1`)
        .flush('Error', { status: 404, statusText: 'Not Found' });
      expect(service.isError()).toBeTrue();
    });
  });

  // ── updateUser ─────────────────────────────────────────────
  describe('updateUser()', () => {
    it('should set updateSuccess to true on success', () => {
      service.updateUser('1', mockUpdateRequest);
      httpMock.expectOne(`${apiUrl}/api/User/1`).flush({});
      expect(service.updateSuccess()).toBeTrue();
    });

    it('should set isLoading to false on success', () => {
      service.updateUser('1', mockUpdateRequest);
      httpMock.expectOne(`${apiUrl}/api/User/1`).flush({});
      expect(service.isLoading()).toBeFalse();
    });

    it('should PUT to correct endpoint', () => {
      service.updateUser('1', mockUpdateRequest);
      const req = httpMock.expectOne(`${apiUrl}/api/User/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });

    it('should set isError to true on failure', () => {
      service.updateUser('1', mockUpdateRequest);
      httpMock.expectOne(`${apiUrl}/api/User/1`)
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.isError()).toBeTrue();
    });
  });
});