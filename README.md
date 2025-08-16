# Notes Sharing App 📝

A full-stack app created primarily to improve backend development skills, while also learning how the frontend handles request/response cycles and routing with backend calls using React. 

> 

## 🚦 Current Status
🚦 Current Status

✅ Backend:
Secure authentication (JWT with Access + Refresh Tokens)
Session management (up to 3 concurrent logins)
Full CRUD for notes
Note sharing at creation
‘Shared with me’ feature implemented



🚧 Frontend:
React in learning phase
Home page, navigation, image slider, and sign-up implemented
Working with useState, useEffect, React Router

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

### api/auth 
```
| Method | Endpoint    | Middleware           | Description                                              |
| ------ | ----------- | -------------------- | -------------------------------------------------------- |
| `POST` | `/register` | —                    | Register a new user.                                     |
| `POST` | `/login`    | —                    | Authenticate a user and return access & refresh tokens.  |
| `POST` | `/refresh`  | `verifyRefreshToken` | Generate a new access token using a valid refresh token. |
| `POST` | `/logout`   | `verifyRefreshToken` | Logout the user and invalidate the refresh token.        |

```

### dashboard (Protected)
```
| Method   | Endpoint                   | Description                                                  |
| -------- | -------------------------- | ------------------------------------------------------------ |
| `POST`   | `/my-notes/create`         | Create a new note for the authenticated user.                |
| `GET`    | `/my-notes`                | Retrieve all notes of the authenticated user.                |
| `PUT`    | `/my-notes/:noteID`        | Edit/update a specific note by its ID.                       |
| `DELETE` | `/my-notes/:noteID`        | Delete a specific note by its ID.                            |
| `GET`    | `/my-notes/shared-with-me` | Get notes that have been shared with the authenticated user. |
| `PATCH`  | `/my-notes/:noteID/share`  | Share a specific note with another user.                     |

```
### admin (protected)
```

| Method   | Endpoint                | Description                               |
| -------- | ----------------------- | ----------------------------------------- |
| `GET`    | `/dashboard`            | Display dashboard items.                  |
| `GET`    | `/notes`                | Retrieve all notes in the system.         |
| `DELETE` | `/notes/:noteID/delete` | Delete a specific note by ID.             |
| `GET`    | `/users`                | Retrieve all users.                       |
| `PUT`    | `/users/:id/role`       | Update a user's role.                     |
| `PUT`    | `/users/:id/status`     | Update a user's status (active/inactive). |
| `DELETE` | `/users/:id/delete`     | Delete a user by ID.                      |


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

backend/
├── config/
│   └── db.js
├── controllers/
│   ├── adminControllers.js
│   ├── authControllers.js
│   └── dashboardControllers.js
├── middlewares/
│   ├── auth.middleware.js
│   └── errorHandler.js
├── models/
│   ├── notesModels.js
│   └── userModels.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   └── dashboard.js
├── utils/
│   └── tokens.js
├── .env
├── app.js
├── db.js
├── server.js
├── package.json
├── package-lock.json
└── node_modules/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── public/
└── package.json

## Status

- ✅ Backend stable and feature-rich
- 🚧 React frontend in active development 

