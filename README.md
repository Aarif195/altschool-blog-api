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

## Getting Started

### Installation

```bash
git clone <repo-url>
cd altschool-blog-api
npm install
