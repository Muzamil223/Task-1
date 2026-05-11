Task Management Web App with Authentication
Task ID: FS-1 | Ref ID: TC-INT-20260430-136
Developer: Muhammad Muzammil Shahbaz

=== PROJECT DESCRIPTION ===
A full-stack Kanban-style task management application built with React, Node.js, Express,
and MongoDB. Supports JWT authentication, role-based access (admin/user), and drag-and-drop
task management across three columns: To-Do, In Progress, and Done.

=== TECH STACK ===
Frontend : React 18, Vite, Tailwind CSS, @hello-pangea/dnd (drag-and-drop), React Router v6
Backend  : Node.js, Express.js, Mongoose
Database : MongoDB (Atlas)
Auth     : JWT (jsonwebtoken + bcryptjs)

=== FEATURES ===
- User registration and login (JWT)
- Role-based access control (Admin / User)
- Full CRUD for tasks
- Kanban board: To-Do, In Progress, Done
- Drag-and-drop task movement across columns (Bonus)
- Assign tasks to team members
- Due dates with overdue indicator
- Priority labels (Low / Medium / High)
- Protected routes — board only accessible when logged in
- Responsive layout

=== HOW TO RUN LOCALLY ===

--- Backend ---
1. cd backend
2. npm install
   - MONGO_URI  : your MongoDB Atlas connection string
   - JWT_SECRET : any long random string
   - PORT       : 5000 (default)
4. npm run dev
   API runs at http://localhost:5000

--- Frontend ---
1. cd frontend
2. npm install
3. npm run dev
   App runs at http://localhost:5173

=== TEST CREDENTIALS (after seeding) ===
Admin : admin@teyzix.com / admin123
User  : muzamil987614@gmail.com  / 12345678
User  : burhan@gmail.com  / 12345678

MONGO_URI=mongodb+srv://muzamil987614_db_user:o1b4y7EU7JhycQTj@task-01-dashboard.74lwjvt.mongodb.net/Task-01-Dashboard?retryWrites=true&w=majority


Register these accounts manually on the /register page or via POST /api/auth/register.

=== FILE STRUCTURE ===
Task-1/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── models/User.js
│   │   ├── models/Task.js
│   │   ├── controllers/authController.js
│   │   ├── controllers/taskController.js
│   │   ├── routes/auth.js
│   │   └── routes/tasks.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/LoginPage.jsx
│   │   ├── pages/RegisterPage.jsx
│   │   ├── pages/DashboardPage.jsx
│   │   ├── components/Navbar.jsx
│   │   ├── components/Board/KanbanBoard.jsx
│   │   ├── components/Board/Column.jsx
│   │   ├── components/Board/TaskCard.jsx
│   │   └── components/Modals/TaskModal.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── API_Documentation.md
└── README.txt

=== DEPLOYMENT ===
Frontend : Vercel (connect /frontend, set VITE_API_URL to your backend URL)
Backend  : Railway (connect /backend, add .env variables in dashboard)
