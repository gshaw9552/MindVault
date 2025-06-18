# MindVault


MindVault is a platform designed to help you save, organize, and explore your personal content. It acts as a digital second brain, allowing you to store various types of content and retrieve them efficiently.

## Features

*   **Content Organization:** Save various types of digital content in one place.
*   **Supported Content Types:**
    *   YouTube videos
    *   Twitter (X) posts
    *   Instagram posts
    *   Plain web links
    *   Music links
    *   Text notes
*   **User Authentication:** Secure signup and signin functionality.
*   **Content Management:** Create, view, and delete content items.
*   **Dynamic Content Display:** Cards adapt to display previews or embeds for different content types (e.g., YouTube player, Twitter embeds).
*   **Filtering:** Filter content by type via the sidebar.
*   **Shareable Brains:** Generate a unique link to share your content collection publicly.

## Project Structure

This repository is a monorepo containing both the backend and frontend applications:

*   **Backend (Root Directory):** The backend server code is located in the root `src/` directory. Configuration and scripts for the backend are in the root `package.json` and `tsconfig.json`.
*   **Frontend (`frontend/`):** The client-side application built with React and Vite is located in the `frontend/` directory. It has its own `package.json` and build configurations.

## Backend (`/`)

The backend is a Node.js application responsible for handling API requests, user authentication, and database interactions.

### Technology Stack

*   Node.js
*   Express.js
*   TypeScript
*   MongoDB (with Mongoose ODM)
*   Zod (for validation)
*   JSON Web Tokens (JWT) for authentication
*   bcrypt for password hashing
*   CORS

### Setup & Running

1.  **Navigate to the root directory** of the repository.
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root directory and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  **Build the TypeScript code:**
    ```bash
    npm run build
    ```
5.  **Run the server:**
    *   For development (builds and starts):
        ```bash
        npm run dev
        ```
    *   For production (starts pre-built code from `dist/`):
        ```bash
        npm run start
        ```
    The server will start on `http://localhost:3000` by default.

### API Endpoints Overview

*   `POST /api/v1/signup`: User registration.
*   `POST /api/v1/signin`: User login.
*   `POST /api/v1/content`: Add new content (requires authentication).
*   `GET /api/v1/content`: Fetch user's content (requires authentication).
*   `DELETE /api/v1/content`: Delete a content item (requires authentication).
*   `POST /api/v1/brain/share`: Generate or remove a public share link for the user's brain (requires authentication).
*   `GET /api/v1/brain/:shareLink`: Fetch content for a public share link.

## Frontend (`frontend/`)

The frontend is a single-page application (SPA) built with React, providing the user interface for MindVAult.

### Technology Stack

*   React
*   TypeScript
*   Vite
*   Tailwind CSS
*   Axios (for API calls)
*   React Router (for navigation)

### Setup & Running

1.  **Navigate to the `frontend/` directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is busy).
4.  **Build for production:**
    ```bash
    npm run build
    ```
    The production-ready files will be generated in the `frontend/dist/` directory.
5.  **Lint the code:**
    ```bash
    npm run lint
    ```

### Key Components

*   **`Dashboard.tsx`:** The main page where users manage and view their content.
*   **`Card.tsx`:** A versatile component for displaying different types of content items (YouTube, Twitter, notes, etc.).
*   **`CreateContentModal.tsx`:** A modal dialog for adding new content items.
*   **`Sidebar.tsx`:** Provides navigation, content type filtering, and sign-out functionality.
*   **`Layout.tsx`:** A higher-order component that structures the main application view with the sidebar and content area.
*   **Icon Components (`frontend/src/icons/`):** A collection of SVG icons used throughout the UI.
*   **`useContent.ts`:** Custom React hook for managing content state and API interactions (fetch, create, delete).

## Configuration

### Backend

*   Environment variables are managed via a `.env` file in the root project directory.
    *   `MONGO_URI`: MongoDB connection string.
    *   `JWT_SECRET`: Secret key for signing and verifying JSON Web Tokens.

### Frontend

*   API endpoint configurations are located in `frontend/src/config/config.ts`:
    *   `BACKEND_URL`: Base URL for the backend server (e.g., `http://localhost:3000`).
    *   `API_BASE`: Base URL for the API endpoints (e.g., `http://localhost:3000/api/v1`).
