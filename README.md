# CnSohie.github.io

Welcome to the capstone workspace for both courses in the Personal Portfolio program. This repository stores the detailed brief for the two culminating projects you must complete: the **Portfolio & Blog API** (back end) and the **Full-Stack Portfolio SPA** (front end). Use this document as a checklist to ensure every functional, security, and deployment requirement is satisfied before submission.

## Project 1 — Portfolio & Blog API (Web Data Management and Application)

### Overview
Design, build, test, and deploy a secure, production-ready REST API that powers your personal portfolio. The API must manage portfolio projects, contact messages, blog posts, comments, and administrative users.

### Technology Stack
- **Runtime:** Node.js with Express
- **Database:** MongoDB Atlas, modeled with Mongoose
- **Security:** bcrypt for password hashing, JWT for authentication, helmet for HTTP headers, dotenv for secrets

### Learning Objectives
1. Apply MVC structure to a Node.js API.
2. Model application data with Mongoose schemas and validation.
3. Implement secure authentication (bcrypt + JWT) and authorization middleware.
4. Build full CRUD for projects, blog posts, comments, and messages.
5. Connect to and operate on a hosted MongoDB database.
6. Deploy the API to a live URL.

### Functional Requirements
#### Phase 1: Models & Structure
- Maintain `models/`, `routes/`, and `controllers/` directories.
- Implement the following Mongoose schemas:
  - **User:** `username`, `email`, `password` (min length 6, all required & unique where noted)
  - **Project:** `title`, `description`, optional `imageUrl`, `repoUrl`, `liveUrl`, plus required `user` ref
  - **BlogPost:** `title`, `content`, required `author` ref, timestamps enabled
  - **Comment:** `body`, required `author` ref, required `post` ref, timestamps enabled
  - **Message:** `name`, `email`, `message`, timestamps enabled

#### Phase 2: Authentication
- Hash passwords during registration and verify on login with bcrypt.
- Issue JWTs upon successful login containing the user ID.
- Endpoints:
  - `POST /api/users/register`
  - `POST /api/users/login`

#### Phase 3: Authorization
- Create `protect` middleware to validate JWTs from the `Authorization: Bearer <token>` header.
- Allow only the author of a blog post to update or delete it. (Assume project management is admin-only.)

#### Phase 4: Portfolio & Blog Endpoints
- **Projects:**
  - `GET /api/projects`
  - `GET /api/projects/:id`
  - `POST /api/projects` *(protected, associates `req.user`)*
  - `PUT /api/projects/:id` *(protected)*
  - `DELETE /api/projects/:id` *(protected)*
- **Contact:**
  - `POST /api/contact` *(public, saves Message)*
- **Blog:**
  - `GET /api/blog` *(populate author username)*
  - `GET /api/blog/:id` *(populate author + comments)*
  - `POST /api/blog` *(protected)*
  - `PUT /api/blog/:id` *(protected & author-only)*
  - `DELETE /api/blog/:id` *(protected & author-only)*
- **Comments:**
  - `GET /api/blog/:postId/comments`
  - `POST /api/blog/:postId/comments` *(protected, associates logged-in user)*

#### Phase 5: Security, Error Handling & Deployment
- Implement centralized error-handling middleware with consistent JSON responses.
- Use `helmet` for secure headers and `dotenv` for secrets (DB URI, JWT secret).
- Deploy the API (e.g., Render, Heroku) and provide the live URL.

### Grading Rubric (100 pts)
| Category | Description | Points |
| --- | --- | --- |
| Database & Models | Correct schemas and Atlas connection | 20 |
| Auth & Authorization | Registration, login, hashing, JWT, middleware | 25 |
| CRUD Endpoints | Project & Blog endpoints, correct authorization | 20 |
| Relationships & Features | Comments, contact, proper `populate()` usage | 15 |
| Structure & Error Handling | MVC organization and centralized errors | 10 |
| Security & Deployment | helmet, dotenv, live deployment | 10 |

### Submission Checklist
1. **Live API URL** (deployed endpoint)
2. **Source Code Repo** link
3. **README.md** documenting all API routes, payloads, and usage instructions

---

## Project 2 — Full-Stack Portfolio SPA (Web Programming)

### Overview
Build and deploy a React-based single-page application that consumes the Portfolio & Blog API. The app should display portfolio content, blog posts, and provide an authenticated admin dashboard for managing data.

### Technology Stack
- **Front end:** React (with hooks)
- **Routing:** React Router
- **Styling:** Tailwind CSS, CSS Modules, or another modern approach
- **State:** useState for local state, Context API for global auth state
- **Deployment:** Netlify, Vercel, or similar

### Learning Objectives
1. Build reusable, responsive React components.
2. Manage client-side routing, including protected routes.
3. Integrate the React UI with your live API (read/write operations).
4. Implement full authentication flow and auth-aware UI.
5. Manage admin CRUD workflows for projects and blog posts.
6. Deploy the production build to a live host.

### Functional Requirements
#### Phase 1: Architecture
- Decompose UI into reusable components (Header, Footer, ProjectCard, BlogPostCard, AdminDashboard, etc.).
- Pass data via props and apply modern responsive styling.

#### Phase 2: State & API Integration
- Use `useState` for forms, loading, and error states.
- Fetch data with `useEffect`:
  - `/projects` page → `GET /api/projects`
  - `/blog` page → `GET /api/blog`
  - `/blog/:id` page → `GET /api/blog/:id`
- Display loading/error messages during API requests.
- Write operations:
  - `/contact` form → `POST /api/contact`
  - `/login` → `POST /api/users/login`
  - `/register` → `POST /api/users/register`
  - `/blog/:id` comments → `POST /api/blog/:postId/comments` (requires auth)
- Include JWT in the `Authorization` header for all admin POST/PUT/DELETE operations.

#### Phase 3: Routing & Global State
- Public routes: `/`, `/projects`, `/blog`, `/blog/:id`, `/contact`, `/login`, `/register`
- Protected route: `/admin` (redirect or guard if not authenticated)
- Use Context API to store token, user info, and login/logout actions.
- Make the Header component auth-aware (show Login/Register vs. Logout/Admin links appropriately).

#### Phase 4: Core Pages
- Persistent Header & Footer across pages.
- `/admin` dashboard must support full CRUD for Projects and Blog Posts via the API.

#### Phase 5: Deployment
- Deploy the production build to a live URL.
- Ensure the deployed front end communicates exclusively with the deployed back end.

### Grading Rubric (100 pts)
| Category | Description | Points |
| --- | --- | --- |
| React Architecture & Design | Responsive, modern, reusable components | 20 |
| Routing | All public routes + protected `/admin` | 15 |
| API Integration (Public) | Data fetching pages + contact form | 20 |
| Auth Flow & Global State | Login/register, Context API, auth-aware nav | 20 |
| API Integration (Protected) | Admin CRUD + commenting with JWT | 20 |
| Deployment | Live site communicates with live API | 5 |

### Submission Checklist
1. **Live Front-End URL** (deployed React app)
2. **Live Back-End URL** (API from Project 1)
3. **Source Code Repo** link
4. **README.md** with project overview, live links, and local setup instructions

---

## Tips for Success
- Start from solid API foundations before building the SPA.
- Keep `.env` secrets out of version control and document required keys.
- Use Postman/Thunder Client to test endpoints before integrating the front end.
- Automate deployments early to catch environment-specific issues.
- Update this README with your actual deployment links once both projects are live.

Good luck building your portfolio ecosystem!

---

## Local Development

### Backend API
1. `cd backend`
2. Copy `.env.example` to `.env` and provide your MongoDB Atlas connection string plus JWT secret.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Run automated tests: `npm test`
6. Seed sample data (optional): `node src/utils/seed.js`

### Front-End SPA
1. `cd frontend`
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your deployed (or local) API URL.
3. Install dependencies: `npm install`
4. Start the Vite dev server: `npm run dev`
5. Execute UI tests: `npm test`
6. Build production assets: `npm run build`

The `frontend` app expects the backend to be reachable at the configured API URL for all CRUD operations.
