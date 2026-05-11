# User Management App

A fullstack user management application built as a pre-internship assignment for GoFive. The application supports full CRUD operations for user management with role-based permissions.

---

## Tech Stack

**Backend**
- ASP.NET Core 10.0
- Entity Framework Core
- SQL Server

**Frontend**
- Angular 20.2.0
- Angular Material
- Reactive Forms

---

## Prerequisites

- [.NET 10.0 SDK (preview)](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) + [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [Node.js v24.14.0](https://nodejs.org/)
- npm 11.9.0
- Angular CLI: `npm install -g @angular/cli`

---

## Getting Started

### 1. Backend Setup

```bash
# Open the solution in Visual Studio
backend/BackendApi/BackendApi.sln

# Or run via terminal
cd backend/BackendApi/BackendApi
dotnet run
```

Update `appsettings.json` with your SQL Server connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=UserManagementDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

### 2. Database Setup (SSMS)

1. Open SSMS and connect to `localhost`
2. Create a new database named `UserManagementDb`
3. Run migrations to create schema and seed Roles/Permissions:
```bash
cd backend/BackendApi/BackendApi
dotnet ef database update
```
4. (Optional) Run `seed.sql` in SSMS to populate sample users

### 3. Frontend Setup

Create the environment file at `frontend/user-management-app/src/environments/environment.ts`:

```ts
export const environment = {
  apiBaseUrl: 'http://localhost:5072'
};
```

Then install and run:
```bash
cd frontend/user-management-app
npm install
ng serve
```

---

## Running the App

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:5072 |
| API Docs (Scalar) | http://localhost:5072/scalar |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/User | Create user |
| GET | /api/User/{id} | Get user by ID |
| PUT | /api/User/{id} | Update user |
| DELETE | /api/User/{id} | Delete user |
| POST | /api/User/DataTable | Get paginated users |
| GET | /api/Roles | Get all roles |
| GET | /api/Permissions | Get all permissions |

---

## Project Structure

```
user-management/
├── backend/
│   └── BackendApi/
│       └── BackendApi/
│           ├── Controllers/
│           ├── Data/
│           ├── Migrations/
│           ├── Models/
│           │   ├── Domain/
│           │   └── DTO/
│           ├── Repositories/
│           │   ├── Interface/
│           │   └── Implementation/
│           ├── Program.cs
│           └── appsettings.json
├── frontend/
│   └── user-management-app/
│       └── src/
│           └── app/
│               ├── components/
│               │   ├── add-user-modal/
│               │   ├── edit-user-modal/
│               │   ├── header/
│               │   ├── pagination/
│               │   ├── search-bar/
│               │   ├── sidebar/
│               │   └── user-table/
│               ├── layout/
│               │   └── main-layout/
│               ├── models/
│               ├── pages/
│               │   ├── dashboard/
│               │   └── documents/
│               ├── services/
│               └── environments/
├── seed.sql
└── README.md
```

---

## Features

- **Dashboard** — paginated user table with search and sort
- **Add User** — form with role selection and module permissions
- **Edit User** — pre-filled form with existing user data
- **Delete User** — confirmation dialog before deletion
- **Form Validation** — required fields, email format, password match, phone format

---

## Scope

Only the **User Dashboard** has been fully implemented (UI + API). Other sidebar pages (Documents, Photos, Hierarchy, etc.) are placeholders.

---

## Notes

- `environment.ts` is excluded from the repository for security. Use `environment.template.ts` as reference.
- GET `/api/User/{id}` returns `isReadable`, `isWritable`, `isDeletable` flags on permissions (extended from original spec to support the edit user feature).
- Passwords are stored as plain text and not intended for production use.