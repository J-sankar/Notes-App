# Notes Sharing App 📝

A full-stack app created primarily to improve backend development skills, while also learning how the frontend handles request/response cycles and routing with backend calls using React. 

> **Note:** The Home page design and Navbar styling were created with the help of GitHub Copilot and ChatGPT.

It supports secure authentication and personal note sharing.

## 🚦 Current Status

- ✅ **Backend:** Secure authentication, session management (3 concurrent logins), full CRUD for notes, note sharing at creation, and 'shared with me' feature are implemented and working well.
- 🔄 **Backend (Planned):** Sharing existing notes after creation, friend/contact system, and advanced sharing options are planned for the next version.
- 🚧 **Frontend:** Currently in the React learning phase. The Home page was designed with the help of AI and features a modern, visually appealing layout. Navigation, image slider, and sign-up section are implemented. Continuing to learn and apply React concepts such as useState, useEffect, and React Router.

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
- Frontend: React + Vite
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
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── dashboard.js
│   ├── .env
│   ├── app.js
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md


## Status

- ✅ Backend stable and feature-rich
- 🚧 React frontend in active development (learning phase)
- 🏠 Home page designed with AI assistance for modern look and usability
