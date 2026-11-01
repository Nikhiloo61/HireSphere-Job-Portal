# HireSphere RESTful API Documentation

This document describes all RESTful API endpoints available in the **HireSphere Job Portal** backend, built with Express.js, Mongoose, MongoDB Atlas / MongoDB, JWT authentication, and Role-Based Access Control (RBAC).

**Base URL:** `http://localhost:5000/api`

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Access:** Public
- **Description:** Registers a new candidate or recruiter account. Validates email format, password length (minimum 6 characters), and prevents duplicate registration.
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securepassword123",
  "role": "candidate",
  "phone": "+1-555-123-4567",
  "location": "San Francisco, CA",
  "skills": "React, Node.js, MongoDB"
}
```
- **Response (`201 Created`):**
```json
{
  "_id": "6724da11234a5b6c7d8e9f01",
  "name": "Jane Doe",
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "candidate",
  "phone": "+1-555-123-4567",
  "location": "San Francisco, CA",
  "skills": "React, Node.js, MongoDB",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Access:** Public
- **Description:** Authenticates user credentials and returns user details with a signed JWT token.
- **Request Body:**
```json
{
  "email": "alex.chen@example.com",
  "password": "candidate123"
}
```
- **Response (`200 OK`):**
```json
{
  "_id": "6724da11234a5b6c7d8e9f02",
  "name": "Alex Chen",
  "fullName": "Alex Chen",
  "email": "alex.chen@example.com",
  "role": "candidate",
  "phone": "+1-555-312-9876",
  "location": "Seattle, WA",
  "skills": "React, Node.js, TypeScript, Docker, Next.js",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.3 Get Current Authenticated User
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Access:** Private (`Authorization: Bearer <token>`)
- **Description:** Validates the JWT session and returns the current user profile.
- **Response (`200 OK`):**
```json
{
  "_id": "6724da11234a5b6c7d8e9f02",
  "name": "Alex Chen",
  "email": "alex.chen@example.com",
  "role": "candidate",
  "skills": "React, Node.js, TypeScript",
  "location": "Seattle, WA"
}
```

---

## 2. User Profile APIs (`/api/users`)

### 2.1 Get Profile
- **Method:** `GET`
- **Endpoint:** `/api/users/profile`
- **Access:** Private
- **Response (`200 OK`):** User object without sensitive password hash.

### 2.2 Update Profile
- **Method:** `PUT`
- **Endpoint:** `/api/users/profile`
- **Access:** Private
- **Request Body:**
```json
{
  "name": "Alex Chen",
  "phone": "+1-555-312-9876",
  "location": "San Francisco, CA",
  "skills": "React, TypeScript, GraphQL, Node.js",
  "education": "B.S. in Computer Science",
  "experience": "4 years Full Stack Engineer",
  "resumeUrl": "https://alexchen.dev/resume.pdf",
  "githubUrl": "https://github.com/alexchen",
  "linkedinUrl": "https://linkedin.com/in/alexchen"
}
```
- **Response (`200 OK`):** Updated user profile object.

### 2.3 Delete Account
- **Method:** `DELETE`
- **Endpoint:** `/api/users/profile`
- **Access:** Private
- **Description:** Permanently deletes user account, applications, and saved bookmarks from MongoDB.
- **Response (`200 OK`):**
```json
{
  "message": "User account and associated records deleted successfully"
}
```

---

## 3. Job Listing APIs (`/api/jobs`)

### 3.1 Get All Jobs
- **Method:** `GET`
- **Endpoint:** `/api/jobs`
- **Access:** Public
- **Query Parameters:**
  - `search` / `q`: Case-insensitive keyword matching (title, company, description, skills)
  - `location`: Exact or partial location match
  - `type` / `employmentType`: 'Full-time', 'Remote', 'Contract', 'Part-time'
  - `experienceLevel`: 'Entry-level', 'Mid-level', 'Senior-level'
  - `category`: 'Engineering', 'AI & Data Science', 'DevOps & Cloud', 'Design & Frontend', 'Security'
  - `minSalary` / `maxSalary`: Numeric LPA salary filtering
  - `sort`: 'newest', 'oldest', 'salary-high', 'salary-low', 'title'
  - `page` & `limit`: Pagination controls
- **Response (`200 OK`):** Array of matching job objects.

### 3.2 Get Job Details
- **Method:** `GET`
- **Endpoint:** `/api/jobs/:id`
- **Access:** Public
- **Response (`200 OK`):** Detailed job document with recruiter reference populated.

### 3.3 Create Job Listing
- **Method:** `POST`
- **Endpoint:** `/api/jobs`
- **Access:** Private (`recruiter` or `admin` role required)
- **Request Body:**
```json
{
  "title": "Cloud Infrastructure Engineer",
  "company": "TechCorp Labs",
  "location": "Remote",
  "type": "Full-time",
  "salary": "20-25 LPA",
  "salaryMin": 20,
  "salaryMax": 25,
  "skills": ["Kubernetes", "AWS", "Terraform", "Go"],
  "experience": "3-5 years",
  "experienceLevel": "Mid-level",
  "category": "DevOps & Cloud",
  "description": "Architect and manage multi-region cloud clusters with automated CI/CD pipelines."
}
```
- **Response (`201 Created`):** Newly created Job document with generated ObjectId.

### 3.4 Update Job Listing
- **Method:** `PUT`
- **Endpoint:** `/api/jobs/:id`
- **Access:** Private (Only the recruiter who created the job or an admin)
- **Request Body:** Partial or complete updated job fields.
- **Response (`200 OK`):** Updated Job document.

### 3.5 Delete Job Listing
- **Method:** `DELETE`
- **Endpoint:** `/api/jobs/:id`
- **Access:** Private (Only the recruiter who created the job or an admin)
- **Response (`200 OK`):**
```json
{
  "message": "Job listing and associated records removed successfully"
}
```

---

## 4. Application APIs (`/api/applications`)

### 4.1 Apply for a Job
- **Method:** `POST`
- **Endpoint:** `/api/applications`
- **Access:** Private (`candidate`)
- **Description:** Submits candidate application. Enforces compound index to prevent duplicate submissions.
- **Request Body:**
```json
{
  "jobId": "6724da11234a5b6c7d8e9f10",
  "coverLetter": "Excited about this opportunity to contribute to your engineering team.",
  "resumeUrl": "https://alexchen.dev/resume.pdf"
}
```
- **Response (`201 Created`):** Populated application document with job and candidate info.

### 4.2 Get User Applications
- **Method:** `GET`
- **Endpoint:** `/api/applications`
- **Access:** Private
- **Behavior by Role:**
  - **Candidate:** Retrieves applications submitted by the logged-in candidate with populated job info.
  - **Recruiter:** Retrieves applications submitted for jobs posted by this recruiter with candidate profiles and resume links.
  - **Admin:** Retrieves all applications system-wide.
- **Response (`200 OK`):** Array of populated application documents.

### 4.3 Get Application Details
- **Method:** `GET`
- **Endpoint:** `/api/applications/:id`
- **Access:** Private (Candidate applicant, recruiter of the job, or admin)
- **Response (`200 OK`):** Populated single application document.

### 4.4 Update Application Status
- **Method:** `PUT`
- **Endpoint:** `/api/applications/:id/status`
- **Access:** Private (Recruiter of the job or Admin)
- **Request Body:**
```json
{
  "status": "Shortlisted"
}
```
*(Valid statuses: `Applied`, `Under Review`, `Shortlisted`, `Accepted`, `Rejected`)*
- **Response (`200 OK`):** Updated application record.

### 4.5 Withdraw Application
- **Method:** `DELETE`
- **Endpoint:** `/api/applications/:id`
- **Access:** Private (Candidate applicant or Admin)
- **Response (`200 OK`):**
```json
{
  "message": "Application successfully withdrawn"
}
```

---

## 5. Saved Jobs APIs (`/api/saved-jobs`)

### 5.1 Bookmark/Save a Job
- **Method:** `POST`
- **Endpoint:** `/api/saved-jobs`
- **Access:** Private (`candidate`)
- **Request Body:**
```json
{
  "jobId": "6724da11234a5b6c7d8e9f10"
}
```
- **Response (`201 Created`):** Populated saved job document.

### 5.2 Get Saved Jobs
- **Method:** `GET`
- **Endpoint:** `/api/saved-jobs`
- **Access:** Private (`candidate`)
- **Response (`200 OK`):** Array of saved jobs with populated job details.

### 5.3 Remove Saved Job
- **Method:** `DELETE`
- **Endpoint:** `/api/saved-jobs/:jobId`
- **Access:** Private (`candidate`)
- **Response (`200 OK`):**
```json
{
  "message": "Job removed from saved bookmarks"
}
```

---

## 6. Seeded Test Accounts

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Admin** | `admin@hiresphere.com` | `admin123` | Full administrative control |
| **Recruiter 1** | `recruiter1@techcorp.com` | `recruiter123` | TechCorp Labs hiring manager |
| **Recruiter 2** | `recruiter2@cloudscale.io` | `recruiter123` | CloudScale Systems talent recruiter |
| **Candidate 1** | `alex.chen@example.com` | `candidate123` | Full Stack Developer |
| **Candidate 2** | `priya.patel@example.com` | `candidate123` | Machine Learning Engineer |
| **Candidate 3** | `marcus.vance@example.com` | `candidate123` | DevOps / Cloud Engineer |
| **Candidate 4** | `elena.rostova@example.com` | `candidate123` | UI/UX Designer |
| **Candidate 5** | `jordan.taylor@example.com` | `candidate123` | Backend Java Developer |
