# API Documentation – TaskBoard
**Base URL:** `http://localhost:5000/api`  
**Auth:** Bearer token in `Authorization` header for protected routes

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "Muhammad Muzammil",
  "email": "muzammil987614@gmail.com",
  "password": "12345678",
  "role": "user"
}
```
**Response `201`:**
```json
{
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
}
```

---

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "muzammil987614@gmail.com", "password": "12345678" }
```
**Response `200`:** Same shape as register.

---

### GET /auth/me  *(Protected)*
Get current logged-in user.

**Response `200`:**
```json
{ "_id": "...", "name": "...", "email": "...", "role": "..." }
```

---

### GET /auth/users  *(Protected)*
Get all users (used for task assignment dropdown).

**Response `200`:**
```json
[{ "_id": "...", "name": "...", "email": "...", "role": "..." }]
```

---

## Task Endpoints  *(All Protected)*

### GET /tasks
Fetch all tasks.

**Response `200`:**
```json
[
  {
    "_id": "...",
    "title": "Build login page",
    "description": "...",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-05-15T00:00:00.000Z",
    "assignedTo": { "_id": "...", "name": "...", "email": "..." },
    "createdBy": { "_id": "...", "name": "...", "email": "..." }
  }
]
```

---

### POST /tasks
Create a new task.

**Body:**
```json
{
  "title": "Build login page",
  "description": "Implement JWT auth flow",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-05-15",
  "assignedTo": "664abc..."
}
```
**Response `201`:** Full task object.

---

### PUT /tasks/:id
Update a task (all fields).

**Body:** Same as POST.  
**Response `200`:** Updated task object.

---

### PATCH /tasks/:id/status
Move task to a new column (used by drag-and-drop).

**Body:**
```json
{ "status": "in-progress" }
```
**Response `200`:** Updated task object.

---

### DELETE /tasks/:id
Delete a task.

**Response `200`:**
```json
{ "message": "Task deleted" }
```

---

## Status Values
| Value | Label |
|---|---|
| `todo` | To Do |
| `in-progress` | In Progress |
| `done` | Done |

## Priority Values
`low` | `medium` | `high`

## Role Values
`user` | `admin`
