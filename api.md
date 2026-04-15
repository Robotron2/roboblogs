# RoboBlogs - API Documentation

Base URL: `/api/v1`

---

## Authentication (`/auth`)

### 1. Register User
Registers a new user and issues auth tokens.

- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** `201 Created`:
  Returns the user (excluding password) and an `accessToken`. An `httpOnly` cookie containing the `refreshToken` is securely set.

### 2. Login User
Authenticates an existing user.

- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** `200 OK`:
  Returns an `accessToken`. Sets the `refreshToken` securely in a cookie.

### 3. Logout User
Clears the `refreshToken` cookie.

- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Response** `200 OK`

### 4. Refresh Token
Exchanges a valid refresh token cookie for a new access token.

- **Method**: `POST`
- **Endpoint**: `/auth/refresh`
- **Cookies**: Requires `refreshToken`
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": { "accessToken": "eyJhbG..." }
  }
  ```

### 5. Forgot Password
Sends a password reset token via email.

- **Method**: `POST`
- **Endpoint**: `/auth/forgot-password`
- **Body**: `{ "email": "john@example.com" }`

### 6. Reset Password
Resets the user's password using the token sent to their email.

- **Method**: `PUT`
- **Endpoint**: `/auth/reset-password/:token`
- **Body**: `{ "password": "newSecurePassword" }`

---

## Users (`/users`)

### 1. Get Current User (Me)
Retrieves the profile data of the currently authenticated user.

- **Method**: `GET`
- **Endpoint**: `/users/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response** `200 OK`: Returns full `user` object.

---

## Posts (`/posts`)

> **Note:** Only users with `admin` roles can Create, Update, or Delete posts.

### 1. Get All Posts
Fetches a paginated list of published posts.

- **Method**: `GET`
- **Endpoint**: `/posts`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (optional keyword search)
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "message": "Posts retrieved successfully",
    "data": {
      "posts": [...],
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
  ```

### 2. Get Single Post by Slug
Retrieves details for a specific post by its generated URL slug.

- **Method**: `GET`
- **Endpoint**: `/posts/:slug`
- **Response** `200 OK`: Returns the targeted `post` document.

### 3. Create Post
- **Method**: `POST`
- **Endpoint**: `/posts`
- **Headers**: `Authorization: Bearer <accessToken>` (Admin Only)
- **Body**:
  ```json
  {
    "title": "My Awesome Post",
    "content": "Full markdown or rich text content here.",
    "coverImage": "url_to_image.jpg"
  }
  ```

### 4. Update Post
- **Method**: `PUT`
- **Endpoint**: `/posts/:id`
- **Headers**: `Authorization: Bearer <accessToken>` (Admin Only)

### 5. Delete Post
- **Method**: `DELETE`
- **Endpoint**: `/posts/:id`
- **Headers**: `Authorization: Bearer <accessToken>` (Admin Only)

---

## Comments (`/comments`)

### 1. Get Post Comments
Fetches paginated comments belonging to a post.

- **Method**: `GET`
- **Endpoint**: `/comments/:postId`
- **Query Parameters**: `page`, `limit`
- **Response** `200 OK`: Returns list of comments matching the post ID.

### 2. Add Comment
Creates a new comment on a specified post.

- **Method**: `POST`
- **Endpoint**: `/comments`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**:
  ```json
  {
    "post": "64abcdef1234567890",
    "content": "This is a great read!"
  }
  ```

### 3. Delete Comment
Removes a comment. Evaluates ownership; the user who created it or an `admin` can delete.

- **Method**: `DELETE`
- **Endpoint**: `/comments/:id`
- **Headers**: `Authorization: Bearer <accessToken>`

---

## Likes (`/likes`)

### 1. Like a Post
Adds a like to the provided post. Enforces unique (userId + postId) indices to prevent duplicate likes.

- **Method**: `POST`
- **Endpoint**: `/likes/:postId/like`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response** `201 Created`

### 2. Unlike a Post
Removes an existing like from a post.

- **Method**: `DELETE`
- **Endpoint**: `/likes/:postId/unlike`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response** `200 OK`

---

## Standard Response Format

All responses from the RoboBlogs API are wrapped in a standard JSON signature for consistency in the frontend client.

### Success Payload Example
```json
{
  "success": true,
  "message": "Operation completed beautifully",
  "data": { ... }
}
```

### Error Payload Example
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```
*(In development environments, an additional `stack` key is provided for debugging)*
