# Altschool Blog API

A full-featured blog application backend built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**.  
Supports authentication, CRUD operations on blogs, pagination, search, sorting, and read tracking.

---

## Features

- **User Authentication**
  - Sign up and login functionality
  - JWT-based authentication with 1-hour expiry

- **Blog Management**
  - Blogs can be in `draft` or `published` state
  - Logged-in users can create, edit, publish, or delete their blogs
  - Drafts are only visible to the blog owner
  - Published blogs are accessible to both logged-in and non-logged-in users

- **Blog Attributes**
  - `title`, `description`, `body`, `tags`, `author`, `state`, `read_count`, `reading_time`, `createdAt`, `updatedAt`

- **Read Tracking**
  - Increments `read_count` for published blogs on each view
  - Calculates `reading_time` based on word count

- **Blog Listing**
  - Paginated (default 20 per page)
  - Filterable by `state`
  - Searchable by `title`, `author`, and `tags`
  - Sortable by `read_count`, `reading_time`, or `createdAt`

- **Security**
  - Passwords hashed using bcrypt
  - JWT protects routes requiring authentication

---

 ## Security
Include the JWT in the header for protected routes:
Authorization: Bearer <your_jwt_token>

## API Reference
 Base URL: https://altschool-blog-api-8yk5.onrender.com/

### Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive a 1h JWT | No |
| POST | `/api/blogs` | Create a new blog | Yes |
| GET | `/api/blogs` | Get all published blogs | No |
| GET | `/api/blogs/:id` | Get a single blog | No |
| PUT | `/api/blogs/:id` | Update a blog | Yes (Owner) |
| DELETE | `/api/blogs/:id` | Delete a blog | Yes (Owner) |

---

## Get All Blogs

Fetches a list of blogs with support for:
- Pagination
- Draft vs published filtering
- Search
- Sorting

---

### Query Parameters

| Parameter     | Type   | Description |
|--------------|--------|-------------|
| page         | number | Page number (default: 1) |
| limit        | number | Number of blogs per page (default: 20) |
| state        | string | `published` or `draft` |
| search       | string | Search keyword |
| sortBy       | string | Field to sort by (e.g. `createdAt`, `read_count`) |
| sortOrder    | string | `asc` or `desc` |
| requesterId  | string | Required when fetching drafts |

---

## Getting Started

### Installation

```bash
git clone <repo-url>
cd altschool-blog-api
npm install
