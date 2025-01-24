# Voices of Change Technical Documentation

## Overview
Voices of Change (voisoc) is a content creation platform focused on leadership, good governance, people power, and human rights activism. The platform consists of a **frontend** built with React, tailwind and a **backend** powered by Node.js, Socket.io and MongoDB. This documentation outlines the implementation details for both components, including key features, setup instructions, and architectural decisions of voisoc.

---


### Tech Stack
## Backend
- **Node.js**: Backend runtime.
- **Express.js**: Web framework for handling routes and middleware.
- **MongoDB**: Database for storing user data, blog posts, and associated metadata.
- **Socket.io**: For messaging functionality
- **JWT**: Authentication.
- **BCrypt**: Password hashing.

### Setup Instructions
## Backend
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


### Tech Stack
## Frontend
- **React**: Frontend library.
- **TailwindCSS**: Styling framework.
- **React Router**: Client-side routing.
- **Heroicons**: Iconography.

### Setup Instructions
## Frontend
1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
2. **Start the Development Server**:
   ```bash
   npm start
   ```

**Environment Variables**:
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Folder Structure
```plaintext
├── backend
│   ├── crud
│   ├── db
│   ├── middlewares
│   ├── node_modules  [208 entries exceeds filelimit, not opening dir]
│   ├── route_wares
│   │   ├── auths
│   │   ├── messages
│   │   ├── posts
│   │   └── users
│   │       └── middlewares
│   └── uploads
│       └── profile_pictures
└── frontend
    ├── certs
    ├── node_modules  [889 entries exceeds filelimit, not opening dir]
    ├── public
    └── src
        ├── assets
        ├── components
        │   ├── auths
        │   ├── contexts
        │   ├── home
        │   ├── layouts
        │   ├── messages
        │   ├── posts
        │   ├── users
        │   │   └── utils
        │   └── utils
        └── utils
```


### Key Features
- **Authentication**:
  - JWT-based login and registration.
  - Secure password hashing with bcrypt.
- **CRUD Operations**:
  - Create, read, update, and delete posts.
  - Manage user profiles.
- **File Upload**:
  - Support for header image uploads via `multer`.
- **Pagination and Filtering**:
  - Efficient data retrieval for blogs with filters.
- **Messaging**:
  - Realtime messaging and media transfers

### API Endpoints
| Method | Endpoint          | Description                   | Auth Required |
|--------|-------------------|-------------------------------|---------------|
| POST   | `/login` | Login a user                 | No            |
| POST   | `/register`| Register a new user          | No            |
| GET    | `/posts`      | Get all posts           | Yes            |
| POST   | `/create-post`      | Create a new  post       | Yes           |
| GET    | `/account`  | Query for user account info | Yes           |
| DELETE | `posts/:id`  | Delete a post           | Yes           |
| PUT	 | `/update`  | Update user profile info           | Yes           |


### Key Features
- **Responsive Design**:
  - Fully functional across devices.
- **User Authentication**:
  - Display user profile picture when logged in.
- **Post Management**:
  - Create, edit, and delete posts.

### Some of the Important Components
#### Navbar
- **Location**: `src/components/home/Navbar.js`
- **Purpose**: Provides navigation links and displays user profile icon.
- **Key Props**:
  - `compact`: Boolean to toggle compact layout.

#### User Account Component
- **Location**: `src/components/users/Profile.js`
- **Purpose**: Shows either a default icon or the user’s profile picture.
- **Key Props**:
  - `isLoggedIn`: Boolean to check login status.
  - `profilePic`: URL of the profile picture.

#### Responsive Layout
- **Location**: `src/components/SingleLayout.js`
- **Purpose**: Ensures consistent layout with sidebar and responsive adjustments.
- **Features**:
  - Fixed footer.
  - Dynamic sidebar width.

---

## Deployment
### Backend
1. Deploy using Heroku
2. Ensuring all the environment variables are properly configured in the hosting platform.

### Frontend
1. Deployed using Vercel.

---

## Development Notes
- `eslint` and `prettier` was used for code formatting.
- TailwindCSS is configured for purge to reduce CSS bundle size in production.
- The frontend and the backend is fully integrated

---

## Future Improvements
- Add support for real-time notifications.
- Enhance post engagement.
- Implement analytics to track post views.

---

## License
This project is licensed under the MIT License. For details, see the `LICENSE` file.

## Author
(ugoMusk)[https://github.com/ugoMusk]