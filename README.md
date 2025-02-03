
# PenXp - Backend

This is the backend repository for **PenXp**. The backend is built using **Node.js**, **Express**, and **MongoDB**. It handles authentication, user management, and serves APIs to the frontend application.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Folder Structure](#folder-structure)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Technologies Used

- **Node.js** - JavaScript runtime for building the server
- **Express** - Web framework for Node.js to handle routing and middleware
- **MongoDB** - NoSQL database for storing application data
- **JWT (JSON Web Token)** - For secure user authentication
- **OAuth** - For login via GitHub, Google, GitLab, and Bitbucket
- **Bcrypt** - For password hashing
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **Axios** - For making HTTP requests (on the backend if needed)

---

## Setup Instructions

To get the server up and running locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/theutpal01/PenXP.git
```

### 2. Install Dependencies

Navigate to the project folder and install the required dependencies:

```bash
cd penxp
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file at the root of the project with the following keys (replace values with your actual credentials):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret
BITBUCKET_CLIENT_ID=your-bitbucket-client-id
BITBUCKET_CLIENT_SECRET=your-bitbucket-client-secret
```

---

## Features

- **User Authentication**: Includes registration, login, and password hashing.
- **OAuth Login**: Allows users to authenticate via **GitHub**, **Google**, **GitLab**, and **Bitbucket**.
- **JWT Tokens**: Secure authentication using JSON Web Tokens (JWT).
- **CRUD API**: Handles user-related actions such as fetching, updating, and deleting user data.
- **MongoDB Integration**: User data and authentication are stored in MongoDB.

---

## API Documentation

### Authentication

- **POST /api/auth/register**: Register a new user.
  - Request Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "message": "User registered successfully!" }`

- **POST /api/auth/login**: Login with email and password.
  - Request Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "token": "JWT_TOKEN" }`

- **GET /api/auth/logout**: Logout and clear JWT token.
  - Response: `{ "message": "Logged out successfully" }`

### OAuth Authentication

- **GET /api/auth/github**: Login with GitHub OAuth.
- **GET /api/auth/google**: Login with Google OAuth.
- **GET /api/auth/gitlab**: Login with GitLab OAuth.
- **GET /api/auth/bitbucket**: Login with Bitbucket OAuth.

---

## Authentication

The server uses **JWT** for authentication. Once a user logs in, a JWT token is issued and must be included in the header of subsequent requests that require authentication.

### Example of using JWT in a request header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Folder Structure

Here’s an overview of the folder structure:

```
/penxp-backend
├── /config        # Configuration files (e.g., MongoDB, OAuth, etc.)
├── /controllers   # Route handlers for each API endpoint
├── /models        # Mongoose models for MongoDB collections
├── /routes        # API routes
├── /middleware    # Middleware (e.g., for authentication)
├── /utils         # Helper functions and utilities
├── .env           # Environment variables
├── server.js      # Main server file to start the app
├── package.json   # Project dependencies and scripts
```

---

## Running Tests

You can run the tests (if available) by using the following command:

```bash
npm test
```

You can use **Jest** or **Mocha** to write unit and integration tests for the backend.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:
- Ensure that MongoDB is running locally or replace `MONGO_URI` with the URI of your cloud MongoDB instance (e.g., MongoDB Atlas).
- Update your OAuth credentials.
