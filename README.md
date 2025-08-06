# Notes Sharing App 📝

A full-stack app with focus on backend architecture using Node.js, Express, MongoDB, and JWT.  
It supports secure authentication and personal note sharing.

---

## Features

- 🔐 JWT Auth (Access + Refresh Tokens)
- 📝 CRUD for notes
- 👥 Share notes with others
- 🧾 Protected dashboard routes
- 🍪 Refresh token via HTTP-only cookies

---

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend (Planned): React + Vite
- Auth: Bcrypt + Access/Refresh token flow

---

## API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout (pending)
```

### Notes (Protected)
```
GET    /dashboard/my-notes
POST   /dashboard/my-notes/create
PUT    /dashboard/my-notes/:noteID
DELETE /dashboard/my-notes/:noteID
GET    /dashboard/my-notes/shared-with-me
```

---

## Setup

1. `cd backend && npm install`
2. Add a `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```
3. Run with `npm start`

---


📁 Project Structure

.
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authControllers.js
│   │   └── dashboardControllers.js
│   ├── middlewares
│   │   └── auth.middleware.js
│   ├── models
│   │   ├── notesModels.js
│   │   └── userModels.js
│   ├── routes
│   │   ├── auth.js
│   │   └── dashboard.js
│   ├── .env
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
├── frontend/
└── README.md



## Status

- ✅ Backend in progress
- 🔄 Basic React frontend planned
