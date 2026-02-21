# Scalable News Portal Backend

A robust and scalable backend system for a multilingual news portal built with Node.js, Express, MongoDB, and Redis.

## Features

- **Multilingual Support**: BN/EN language support.
- **RBAC**: Role-Based Access Control (Admin, Editor, Public).
- **JWT Authentication**: Secure API access.
- **High Read Performance**: 
    - Redis caching for single articles, homepage, and categories.
    - Optimized MongoDB indexing.
- **Scalable View Counter**: 
    - Uses Redis `INCR` for real-time tracking.
    - Batch updates MongoDB every 5 minutes via background job.
- **Clean Architecture**: Controller-Service-Repository pattern.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Auth**: JWT, BcryptJS
- **Task Scheduling**: Node-cron

## Prerequisites

- Node.js (v16+)
- MongoDB
- Redis

## Setup

1. **Prerequisites**: Node.js (v16+), MongoDB, and Redis installed.
2. **Clone the repository**
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/news-portal
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
5. **Seed the database**:
   ```bash
   npm run seed
   ```
6. **Run the application**:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a user (Admin/Editor/Public)
- `POST /api/auth/login`: Login and get JWT

### Public
- `GET /api/home`: Get latest, featured, and trending articles (Cached 60s)
- `GET /api/categories`: Get category list (Cached 60s)
- `GET /api/articles`: Paginated list with filters (language, categoryId, sort)
- `GET /api/articles/:slug`: Get article details (Cached 5m)

### Admin/Editor (Protected)
- `POST /api/admin/articles`: Create article
- `PUT /api/admin/articles/:id`: Update article (Invalidates cache)
- `DELETE /api/admin/articles/:id`: Soft delete article (Invalidates cache)

## Project Structure

```
src/
├── config/         # Database and Redis configurations
├── controllers/    # Request handlers
├── jobs/           # Background jobs (cron)
├── middleware/     # Auth and error handling
├── models/         # Mongoose schemas
├── repositories/   # Database access layer
├── routes/         # API routing
├── services/       # Business logic and caching
└── utils/          # Helper functions
```

## Strategy: View Counter & Caching
- **View Counter**: Each hit to `/api/articles/:slug` increments a counter in Redis for that article. A background job runs every 5 minutes, aggregates these counts, and updates the MongoDB `viewCount` field in one batch operation per article.
- **Cache Invalidation**: When an article is updated or deleted via admin routes, the specific article cache and list caches (home, categories) are invalidated to ensure data consistency.
