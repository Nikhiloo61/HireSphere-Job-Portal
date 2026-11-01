# HireSphere — Job Portal Web Application

A responsive job portal built with **React.js** and **Bootstrap 5**, created as a college practical / viva project. Users can register, log in, browse and filter jobs, apply for jobs, track their applications, and manage their profile — all using plain JavaScript data and React's `useState()`, with no backend or browser storage.

---

## 1. Features

- Responsive registration and login screens built with Bootstrap 5
- Form validation with JavaScript + Bootstrap's `is-valid` / `is-invalid` classes, required fields, email format checks, and password length/match checks
- Protected routes — Dashboard, Jobs, Applications, and Profile are only reachable once "logged in" for the current session
- Dashboard with live stats: Available Jobs, Applied Jobs, Shortlisted, Profile Completion
- Job listings rendered dynamically from a static JavaScript array using `.map()`
- Search jobs by title / company / skill, plus filters for location, job type, experience level and salary range
- "No jobs found" empty state
- Apply for jobs — instantly reflected in the Applications tracker
- Save / bookmark jobs
- Application tracking with statuses: Applied, Under Review, Shortlisted, Rejected
- Editable user profile with a live profile-completion percentage
- Fully responsive (mobile, tablet, desktop) with a blue/indigo theme

---

## 2. Tech Stack

| Technology        | Purpose                                   |
|--------------------|--------------------------------------------|
| React 18 (Vite)    | UI library / build tool                    |
| React Router v6    | Client-side routing & protected routes     |
| Bootstrap 5        | Grid system, forms, components, utilities  |
| Bootstrap Icons    | Iconography                                |

There is **no backend, database, or browser storage** in this project. Registered users, the logged-in user, and job applications all live in plain React state (`useState()`) inside `App.jsx` for the current browser session, and are passed down to pages/components as props. Job listings come from a static JavaScript array in `src/data/jobsData.js`. Because nothing is persisted to `localStorage`, refreshing the page resets the session — this keeps the project simple and easy to explain in a viva.

---

## 3. Project Structure

```
HireSphere_Job_Portal/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                 # App entry point, imports Bootstrap CSS/JS
    ├── App.jsx                  # Routes + all app-level state (users, user, applications)
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── DashboardCard.jsx
    │   ├── JobCard.jsx
    │   ├── JobList.jsx
    │   ├── SearchFilter.jsx
    │   ├── RegistrationForm.jsx
    │   ├── LoginForm.jsx
    │   ├── Profile.jsx
    │   └── Applications.jsx
    ├── pages/
    │   ├── Register.jsx
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   ├── Jobs.jsx
    │   ├── ApplicationsPage.jsx
    │   └── ProfilePage.jsx
    ├── data/
    │   └── jobsData.js          # Static sample job listings (plain JS array)
    ├── utils/
    │   └── profileCompletion.js
    └── styles/
        └── custom.css           # Blue/indigo theme, layered on Bootstrap
```

---

## 4. Installation & Running the Project

**Prerequisites:** Node.js 18+ and npm installed.

```bash
# 1. Unzip the project and move into the folder
cd HireSphere_Job_Portal

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

The app will open at **http://localhost:5173**.

To build for production:

```bash
npm run build
npm run preview
```

---

## 5. How to Use / Demo Flow

1. Open the app → you're redirected to **/login**.
2. Click **"Create an account"** → fill the registration form → submit. Try leaving a field blank or typing a bad email first to see the red `is-invalid` messages.
3. You're redirected to **Login** → sign in with the same email/password you just registered.
4. You land on the **Dashboard** with live stats.
5. Go to **Jobs** → search/filter → click **Apply Now** on a few jobs.
6. Go to **Applications** → see your applied jobs; click **"Simulate Status Update"** to demo status changes (Applied → Under Review → Shortlisted/Rejected) — this simulates what a recruiter action would do in a real backend.
7. Go to **Profile** → click **Edit** → update Education/Experience/Resume info → **Save Changes** → watch the profile-completion percentage increase.
8. Click your name (top-right) → **Logout**.

Since there's no backend or browser storage, all of this data lives only in React state for the current session — refreshing the page starts a fresh session.

---

## 6. How Major React Concepts Are Used

- **Components & JSX**: The UI is broken into small, reusable components (`JobCard`, `DashboardCard`, `Navbar`, `Form`-style inputs, etc.) that each return JSX and take props.
- **Props**: Data flows down from `App.jsx` → pages → components (e.g. `Jobs.jsx` passes `filters`, `onChange`, `onClear` into `SearchFilter`, and receives `applications` / `setApplications` from `App.jsx`).
- **`useState`**: Used throughout for state — registered users, the logged-in user, applications, form fields, validation errors, and search/filter values.
- **Controlled Components**: All form inputs (`RegistrationForm`, `LoginForm`, `SearchFilter`, `Profile`) are controlled — their value comes from state and updates via `onChange`.
- **Conditional Rendering**: Used for validation messages, the "No jobs found" state, the empty-applications state, and toggling Edit/View mode on the Profile page.
- **Lists & Keys**: `jobsData.map()` renders `JobCard`s with a unique `key={job.id}`; applications and skills are rendered the same way.
- **`filter()`**: Powers job search and filtering (`Jobs.jsx`) and application-status lookups.
- **React Router (`react-router-dom`)**: `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>`, `<NavLink>`, and `<Navigate>` handle page navigation without full page reloads.
- **Protected Routes**: A custom `ProtectedRoute` component wraps private pages and redirects to `/login` using `<Navigate>` if no user is logged in.
- **Lifting State Up**: `users`, the logged-in `user`, and `applications` all live in `App.jsx` and are passed down as props; callbacks like `onRegister`, `onAuthSuccess`, `onLogout`, and `setApplications` let child components update that shared state.

---

## 7. Short Viva Questions & Answers

**Q1. Why did you use React for this project?**
A: React lets us build the UI as reusable, independent components (`JobCard`, `Navbar`, `Form`), and its virtual DOM efficiently re-renders only the parts of the page that change — e.g. re-filtering the job list doesn't re-render the navbar.

**Q2. What is the difference between props and state?**
A: `state` is data owned and managed inside a component (e.g. the text typed into a search box). `props` are read-only data passed *into* a component from its parent (e.g. `SearchFilter` receives `filters` as a prop from `Jobs.jsx`). State can change over time via `setState`/`useState`; props cannot be changed by the component receiving them.

**Q3. How does `useState` work in this project?**
A: `useState` returns a `[value, setValue]` pair. Calling `setValue` schedules a re-render with the new value. For example, `App.jsx` holds `const [applications, setApplications] = useState([])`; clicking "Apply Now" in `Jobs.jsx` calls `setApplications` to add a new entry, and that update flows down to the Dashboard and Applications page automatically.

**Q4. Where is the job data stored?**
A: In a plain JavaScript array in `src/data/jobsData.js`. It's imported directly into `Jobs.jsx` and `Dashboard.jsx` and rendered with `.map()` — no database or API is involved.

**Q5. How is routing implemented without a backend?**
A: `react-router-dom`'s `<BrowserRouter>` manages the URL and renders the matching `<Route>` component on the client side. No server round-trip is needed to change pages.

**Q6. How do you protect routes like the Dashboard from unauthenticated access?**
A: A `ProtectedRoute` wrapper component checks if a `user` prop exists. If not, it renders `<Navigate to="/login" />`, redirecting the browser before the protected page ever renders.

**Q7. Where is user data stored, and is it secure?**
A: Registered users, the current session's logged-in user, and applications all live only in React state (`useState`) inside `App.jsx`, for the current browser session — nothing is written to `localStorage`, a database, or a server. This keeps the demo simple, but it also means the data resets on refresh and passwords are handled as plain text, which would never be acceptable in a real production app (a real app needs a backend with hashed passwords and server-side authentication).
