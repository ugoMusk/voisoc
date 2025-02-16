# Voisoc Technical Documentation

## Overview
Voisoc is a content creation platform focused on leadership, good governance, people power, and human rights activism. The platform consists of a **frontend** built with React and a **backend** powered by Node.js and MongoDB. This documentation outlines the implementation details for both components, including key features, setup instructions, and architectural decisions.

---

## Backend

### Tech Stack
- **Node.js**: Backend runtime.
- **Express.js**: Web framework for handling routes and middleware.
- **MongoDB**: Database for storing user data, blog posts, and associated metadata.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Authentication.
- **BCrypt**: Password hashing.

### Folder Structure
```plaintext
backend/
├── controllers/    # Business logic for handling routes
├── models/         # Mongoose schemas for database entities
├── routes/         # API route definitions
├── middlewares/    # Middleware functions (e.g., authentication)
├── config/         # Configuration files (e.g., database connection)
├── utils/          # Helper functions
├── server.js       # Entry point
```

### Key Features
- **Authentication**:
  - JWT-based login and registration.
  - Secure password hashing with bcrypt.
- **CRUD Operations**:
  - Create, read, update, and delete blog posts.
  - Manage user profiles.
- **File Upload**:
  - Support for header image uploads via `multer`.
- **Pagination and Filtering**:
  - Efficient data retrieval for blogs with filters.

### API Endpoints
| Method | Endpoint          | Description                   | Auth Required |
|--------|-------------------|-------------------------------|---------------|
| POST   | `/api/auth/login` | Login a user                 | No            |
| POST   | `/api/auth/signup`| Register a new user          | No            |
| GET    | `/api/posts`      | Get all posts           | No            |
| POST   | `/api/posts`      | Create a new  post       | Yes           |
| PUT    | `/api/posts/:id`  | Update an existing post | Yes           |
| DELETE | `/api/posts/:id`  | Delete a post           | Yes           |

### Setup Instructions
1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```
2. **Configure Environment Variables**:
   Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. **Run the Server**:
   ```bash
   npm start
   ```

---

## Frontend

### Tech Stack
- **React**: Frontend library.
- **TailwindCSS**: Styling framework.
- **React Router**: Client-side routing.
- **Heroicons**: Iconography.

### Folder Structure
```plaintext
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route-specific components
│   ├── contexts/      # Context API for global state
│   ├── utils/         # Helper functions
│   ├── App.js         # Root component
│   └── index.js       # Entry point
├── public/            # Static files
```

### Key Features
- **Responsive Design**:
  - Fully functional across devices.
- **User Authentication**:
  - Display user profile picture when logged in.
- **Blog Management**:
  - Create, edit, and delete blog posts.
  - Display a feed of blogs.
- **Markdown Editor**:
  - Write and format blog content.

### Important Components
#### Navbar
- **Location**: `src/components/Navbar.js`
- **Purpose**: Provides navigation links and displays user profile icon.
- **Key Props**:
  - `compact`: Boolean to toggle compact layout.

#### User Account Component
- **Location**: `src/components/UserAccount.js`
- **Purpose**: Shows either a default icon or the user’s profile picture.
- **Key Props**:
  - `isLoggedIn`: Boolean to check login status.
  - `profilePic`: URL of the profile picture.

#### Responsive Layout
- **Location**: `src/components/ResponsiveLayout.js`
- **Purpose**: Ensures consistent layout with sidebar and responsive adjustments.
- **Features**:
  - Fixed footer.
  - Dynamic sidebar width.

### Setup Instructions
1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
2. **Start the Development Server**:
   ```bash
   npm start
   ```

### Environment Variables
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Deployment
### Backend
1. Deploy the backend using services like Heroku, AWS, or DigitalOcean.
2. Ensure the environment variables are properly configured in the hosting platform.

### Frontend
1. Build the React app:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to platforms like Netlify, Vercel, or an S3 bucket.

---

## Development Notes
- Use `eslint` and `prettier` for code formatting.
- Ensure TailwindCSS is configured for purge to reduce CSS bundle size in production.
- Test all API endpoints using Postman or similar tools.

---

## Future Improvements
- Add support for real-time notifications.
- Enhance the markdown editor with preview functionality.
- Implement analytics to track blog views.

---

## License
This project is licensed under the MIT License. For details, see the `LICENSE` file.
