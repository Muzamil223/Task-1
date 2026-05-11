# Technical Summary – Task FS-1
**Developer:** Muhammad Muzammil Shahbaz  
**Ref ID:** TC-INT-20260430-136  
**Task:** Task Management Web App with Authentication

---

## Architecture Overview

The application follows a standard **Client-Server** architecture with a clear separation between frontend and backend.

**Frontend (React SPA)** communicates with the **Backend (REST API)** over HTTP. The backend reads and writes to **MongoDB Atlas** via Mongoose ODM. Authentication is stateless using **JWT tokens** stored in `localStorage`.

---

## Key Architecture Decisions

### 1. JWT over Session-based Auth
JWT was chosen because it is stateless — the server does not store session data. Each request carries its own identity via the signed token. This scales better and is simpler to deploy across separate frontend/backend services (Vercel + Railway).

### 2. Modular Backend Structure (Controller → Route → Model)
The backend separates concerns: routes define URL patterns, controllers hold business logic, and models define the data schema. This makes the codebase easy to extend — adding a new resource means adding a model, controller, and route file independently.

### 3. Optimistic UI Updates for Drag-and-Drop
When a task is dragged to a new column, the frontend updates state immediately before confirming with the API. If the API call fails, the state is reverted. This makes the UI feel instant without waiting for a round-trip.

### 4. Centralized Axios Instance
A single Axios instance with request and response interceptors handles token injection automatically on every outgoing request, and auto-redirects to `/login` on any 401 response. This avoids duplicating auth logic across every API call.

### 5. Role-Based Access Control
User documents carry a `role` field (`admin` or `user`). The backend exposes an `adminOnly` middleware (ready for role-restricted endpoints). The frontend allows any authenticated user to register as admin for demo purposes.

---

## Bonus Features Implemented
- **Drag-and-drop** task movement using `@hello-pangea/dnd`
- **Role-based access control** (Admin/User) at both model and middleware level
- **Overdue indicator** on task cards (visual red warning when due date has passed)

---

## Deployment Strategy
| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Set `VITE_API_URL` env var to Railway backend URL |
| Backend | Railway | Add `.env` variables in Railway dashboard |
| Database | MongoDB Atlas | Free tier sufficient for demo |
