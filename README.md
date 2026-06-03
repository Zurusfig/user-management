# User Management App

A fullstack user management application built as a pre-internship assignment for GoFive. The application supports full CRUD operations for user management with role-based permissions.

---

## Tech Stack

**Backend**
- ASP.NET Core 9.0
- Entity Framework Core
- SQL Server

**Frontend**
- Angular 20.2.0
- Angular Material
- Reactive Forms

---

## Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- [SQL Server](https://learn.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server?view=sql-server-ver16&culture=en-us&country=us) + [SSMS](https://www.microsoft.com/en-ie/download/details.aspx?id=8961)
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

Create both environment files:

**`src/environments/environment.ts`** (production):
```ts
export const environment = {
  apiBaseUrl: 'YOUR_API_URL_HERE'
};
```

**`src/environments/environment.development.ts`** (development):
```ts
export const environment = {
  apiBaseUrl: 'YOUR_API_URL_HERE'
};
```

Both files should point to the same API URL during development.

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
- Passwords are stored as plain text — not intended for production use.

---

# Mac Setup Guide — User Management App

> This project was built on Windows. Follow this guide to run it on macOS.

---

## Key Differences from Windows Setup

| Windows | Mac Replacement |
|---|---|
| SQL Server (native) | SQL Server via Docker (azure-sql-edge for M1/M2/M3) |
| SSMS | DBeaver Community |
| Azure Data Studio | ~~Retired Feb 28, 2026~~ — use DBeaver |
| Visual Studio | Terminal + `dotnet` CLI |

---

## Prerequisites

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install dotnet@9 node
brew install --cask docker dbeaver-community

# Install Angular CLI & EF tools
npm install -g @angular/cli
dotnet tool install --global dotnet-ef
```

---

## Step 1 — SQL Server via Docker

Check your chip first:
```bash
uname -m
```

**If `arm64` (M1/M2/M3):**
```bash
docker run -e ACCEPT_EULA=1 -e MSSQL_SA_PASSWORD=YourPassword123! -p 1433:1433 --name sqlserver -d mcr.microsoft.com/azure-sql-edge
```

**If `x86_64` (Intel):**
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

> Wait ~15 seconds after starting for SQL Server to initialize.

---

## Step 2 — Fix Connection String

> NOTE: `Program.cs` reads the key `"UserManagementConnectionString"` — make sure `appsettings.json` uses this exact key.

`backend/BackendApi/BackendApi/appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "UserManagementConnectionString": "Server=localhost,1433;Database=UserManagementDb;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True"
  }
}
```

---

## Step 3 — Run Migrations

> NOTE: EF design-time tools can't auto-read `appsettings.json` — always pass `--connection` explicitly.

```bash
cd backend/BackendApi/BackendApi
dotnet ef database update --connection "Server=localhost,1433;Database=UserManagementDb;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True"
```

---

## Step 4 — Seed Data (Optional)

Open DBeaver → connect to `localhost:1433` with user `sa` → open `seed.sql` from repo root → run it.

---

## Step 5 — Run the App

**Terminal 1 — Backend:**
```bash
cd backend/BackendApi/BackendApi
dotnet run
```

**Terminal 2 — Frontend:**

Create environment files first:
```bash
cd frontend/user-management-app

mkdir -p src/environments

cat > src/environments/environment.ts << 'EOF'
export const environment = {
  apiBaseUrl: 'http://localhost:5072'
};
EOF

cat > src/environments/environment.development.ts << 'EOF'
export const environment = {
  apiBaseUrl: 'http://localhost:5072'
};
EOF
```

Then:
```bash
npm install
ng serve
```

---

## Running Services

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:5072 |
| API Docs (Scalar) | http://localhost:5072/scalar |

---

## Every Time You Restart Your Mac

Docker containers don't auto-start. Run this before starting the app:
```bash
docker start sqlserver
```
