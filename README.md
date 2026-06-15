# Notes App — Django + React

A full-stack notes management application with user authentication, built with Django REST Framework on the backend and React on the frontend. Deployed to production on WSO2 Choreo with a cloud PostgreSQL database.

## Features

- User registration and login with JWT authentication
- Create, view, and delete personal notes
- Each user only sees their own notes (author-scoped data)
- Token auto-refresh and protected routes
- Responsive UI with loading states
- Production PostgreSQL database (Aiven Cloud)
- Deployed backend and frontend on Choreo

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python / Django 6 | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT authentication (access + refresh tokens) |
| PostgreSQL (Aiven Cloud) | Production database |
| psycopg2-binary | PostgreSQL driver |
| gunicorn | Production WSGI server |
| django-cors-headers | Cross-origin request handling |
| python-dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool and dev server |
| React Router v7 | Client-side routing and protected routes |
| Axios | HTTP client with request interceptors |
| jwt-decode | Decoding JWT tokens client-side |

### Infrastructure
| Service | Purpose |
|---|---|
| WSO2 Choreo | Backend and frontend deployment platform |
| Aiven Cloud | Managed PostgreSQL database |
| GitHub | Source control and CI/CD trigger |

---

## Architecture

```
┌────────────────────────────────────────────┐
│              React Frontend                │
│  (Vite, React Router, Axios)               │
│  Hosted on: Choreo Web App                 │
└──────────────────┬─────────────────────────┘
                   │ HTTPS + JWT Auth
                   ▼
┌────────────────────────────────────────────┐
│           Choreo API Gateway               │
│  (API-level security, routing)             │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│           Django REST Framework            │
│  (JWT auth, business logic, ORM)           │
│  Hosted on: Choreo Service                 │
└──────────────────┬─────────────────────────┘
                   │ SSL (sslmode=require)
                   ▼
┌────────────────────────────────────────────┐
│        Aiven Cloud PostgreSQL              │
│  (Managed, cloud-hosted database)          │
└────────────────────────────────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/register/` | No | Create a new user account |
| POST | `/api/token/` | No | Login — returns access + refresh tokens |
| POST | `/api/token/refresh/` | No | Get a new access token using refresh token |
| GET | `/api/notes/` | Yes | List all notes for the logged-in user |
| POST | `/api/notes/` | Yes | Create a new note |
| DELETE | `/api/notes/<id>/` | Yes | Delete a specific note |

---

## Project Structure

```
Notes_App_Django_React/
├── backend/
│   ├── api/
│   │   ├── models.py          # Note model (title, content, author, created_at)
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # NoteListCreateView, NoteDeleteView, RegisterView
│   │   └── urls.py            # API URL routing
│   ├── backend/
│   │   ├── settings.py        # Django settings (env-based config)
│   │   └── urls.py            # Root URL config
│   ├── .choreo/
│   │   └── endpoints.yaml     # Choreo endpoint configuration
│   ├── Procfile               # gunicorn startup command (runs migrations first)
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api.js             # Axios instance with JWT interceptor
    │   ├── constants.js       # Token key names
    │   ├── components/
    │   │   ├── Form.jsx       # Reusable login/register form
    │   │   ├── Note.jsx       # Individual note card with delete
    │   │   ├── ProtectedRoute.jsx  # Auth guard for private pages
    │   │   └── LoadingIndicator.jsx
    │   ├── pages/
    │   │   ├── Home.jsx       # Notes dashboard (list + create + delete)
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── NotFound.jsx
    │   └── styles/            # Component-scoped CSS
    ├── index.html
    └── vite.config.js
```

---

## Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 22.12+
- PostgreSQL (or use SQLite for local dev)

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv myenv
myenv\Scripts\activate        # Windows
# source myenv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create backend/.env
SECRET_KEY=your-secret-key
DEBUG=True
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USER=your-db-user
DB_NAME=your-db-name
DB_PASSWORD=your-db-password

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create frontend/.env
VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

---

## Deployment

### Backend — Choreo Service

1. Push code to GitHub
2. Create a **Service** component on Choreo pointing to `/backend`
3. Set build environment: Python
4. Choreo reads `Procfile` to start the app:
   ```
   web: python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```
5. Add environment variables (SECRET_KEY, DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD)
6. Choreo reads `.choreo/endpoints.yaml` to expose the API

### Frontend — Choreo Web App

1. Create a **Web App** component on Choreo pointing to `/frontend`
2. Build command: `npm run build`
3. Build output: `dist`
4. Node version: 22.12
5. Set `VITE_API_URL` to the deployed backend URL

### Database — Aiven Cloud PostgreSQL

- Managed PostgreSQL on Aiven Cloud
- SSL required (`sslmode=require` in Django settings)
- Connection details stored as environment variables, never in source code

---

## Environment Variables

### Backend (`backend/.env`)
```
SECRET_KEY=
DEBUG=
DB_HOST=
DB_PORT=
DB_USER=
DB_NAME=
DB_PASSWORD=
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=
```

---

## Authentication Flow

```
1. User registers  →  POST /api/register/
2. User logs in    →  POST /api/token/  →  receives { access, refresh }
3. Tokens stored in localStorage
4. Every request   →  Authorization: Bearer <access_token>
5. Token expired?  →  POST /api/token/refresh/ with refresh token
6. Refresh expired →  Redirect to /login
```

---

## Author

**Abdullah**
- GitHub: [@AbdullahHAK](https://github.com/AbdullahHAK)
