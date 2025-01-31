# Technical Documentation: voiSoc Backend

## **Introduction**
This document provides a comprehensive guide to setting up and running the backend of the "Voices of Change" application. The backend is built with Node.js and Express and uses MongoDB as the database. The guide covers dependencies, setup instructions, and common issues you may encounter with solutions to resolve them.

---

## **Tech Stack and Dependencies**

### **Tech Stack:**
- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: Framework for building REST APIs.
- **MongoDB**: NoSQL database for storing application data.

### **Issue: MongoDB Installation Not Found in System Repository for Linux environments**

**Problem:**
When attempting to install MongoDB using `sudo apt-get install -y mongodb`, an error may be encountered indicating that the package is not available or has no installation candidate.

**Cause:**
The default Ubuntu repositories may not include the desired MongoDB version, or the `mongodb` package might not exist in these repositories.

**Solution:**
Follow these steps to resolve the issue by installing MongoDB from its official repository:

1. **Add MongoDB's official GPG key:**  
   Run the following command to add MongoDB's repository key:  
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo tee /usr/share/keyrings/mongodb-server-6.0.gpg > /dev/null
   ```

2. **Create the MongoDB repository file:**  
   Add MongoDB's official repository to your system's package sources:  
   ```bash
   echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```

3. **Update your package list:**  
   Run the following command to fetch the updated package list, first ensuring you have root privieges on the system:  
   ```bash
   sudo apt-get update
   ```

4. **Install MongoDB:**  
   Install the latest version of MongoDB with:  
   ```bash
   sudo apt-get install -y mongodb-org
   ```

5. **Start MongoDB:**  
   Ensure the MongoDB service is started:  
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

6. **Verify Installation:**  
   Confirm that MongoDB is installed and running by checking its version:  
   ```bash
   mongod --version
   ```

By following these steps, you should successfully install MongoDB on your system even if it is unavailable in the default repositories.



### **Dependencies:**
[See Here](package.json)


### **Development Tools:**
- **nodemon**: Automatically restarts the server on code changes.

### **File Structure Overview:**
```plaintext
backend/
  |-- config/
  |     |-- db.js       # MongoDB connection setup
  |
  |-- routes/
  |     |-- authRoutes.js # Authentication routes
  |     |-- userRoutes.js # User-specific routes
  |
  |-- server.js         # Main entry point
  |-- .env              # Environment variables
```

---

## **Setup Instructions**

### **Step 1: Install Node.js**
Ensure you have Node.js installed. Use the following commands to check or install:
```bash
node -v   # Check Node.js version
npm -v    # Check npm version
```
If not installed, download from [Node.js official website](https://nodejs.org/).

---

## **Optional: Using nvm for Node.js Version Management**

If you'd like to manage multiple versions of Node.js seamlessly, you can use `nvm` (Node Version Manager).

### **Installing nvm**
Follow the installation instructions from the [nvm GitHub repository](https://github.com/nvm-sh/nvm#install--update-script)

Alternavely, for Linux environments download and run the installation script with the follow command to install:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```

### **Using nvm**
Once installed, use the following commands to manage Node.js versions:
```bash
nvm install 16   # Install Node.js version 16
nvm use 16       # Use Node.js version 16
nvm alias default 16 # Set version 16 as default
```

---

### **Step 2: Clone the Repository**
Clone the project repository and navigate to the `backend` directory:
```bash
git clone <repository-url>
cd backend
```

---

### **Step 3: Install Dependencies**
Install all required packages using npm:
```bash
npm install
```

---

### **Step 4: Set Environment Variables**
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
```

#### **Tips:**
- Replace `<your-mongodb-connection-string>` with your MongoDB connection string.
- Replace `<your-secret-key>` with a strong secret key (e.g., generated using `openssl rand -base64 32`).

---

### **Step 5: Run the Server**
Use the following command to start the server:
```bash
npm run dev
```
This will run the server using `nodemon`, which reloads the server on code changes.

---

## **Common Issues and Workarounds**

### **1. MongoDB Connection Issues**
**Problem:** "MongoParseError: URI malformed"

**Cause:** Special characters in the MongoDB connection string password (e.g., `%`, `@`).

**Solution:**
- URL-encode special characters in your password. For example:
  - Replace `%` with `%25`.
- Correct format for `MONGO_URI`:
  ```env
  MONGO_URI=mongodb+srv://username:password@cluster-url.mongodb.net/dbname?retryWrites=true&w=majority
  ```

---

### **2. Missing or Incorrect `.env` Variables**
**Problem:** Server crashes or behaves unexpectedly.

**Solution:**
- Double-check the `.env` file for:
  - `PORT` value.
  - Valid MongoDB URI in `MONGO_URI`.
  - A strong `JWT_SECRET` value.

**Test Environment Variables:**
Add the following to `server.js` to log the variables (for debugging only):
```javascript
console.log("Mongo URI:", process.env.MONGO_URI);
console.log("JWT Secret:", process.env.JWT_SECRET);
```

---

### **3. Package Installation Errors**
**Problem:** "Module not found" or dependency issues.

**Solution:**
- Ensure all dependencies are installed:
  ```bash
  npm install
  ```
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

### **4. CORS Errors During API Requests**
**Problem:** "CORS policy: No 'Access-Control-Allow-Origin' header."

**Solution:**
- Check the `cors` configuration in `server.js`:
  ```javascript
  app.use(cors());
  ```
- For stricter settings:
  ```javascript
  app.use(cors({ origin: "http://localhost:3000" }));
  ```

---

### **5. JWT Authentication Fails**
**Problem:** "Invalid token" or "Authentication error."

**Solution:**
- Ensure `JWT_SECRET` in `.env` matches the one used to sign tokens in `authRoutes.js`.
- Token expiration issues:
  - Extend or adjust the `expiresIn` value when signing the token:
    ```javascript
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    ```

---

## **Testing the Backend**

### **API Endpoints:**

#### **1. Authentication Routes**
- **Register:**
  - Endpoint: `POST /api/auth/register`
  - Body:
    ```json
    {
      "username": "exampleuser",
      "email": "example@example.com",
      "password": "examplepassword"
    }
    ```

- **Login:**
  - Endpoint: `POST /api/auth/login`
  - Body:
    ```json
    {
      "email": "example@example.com",
      "password": "examplepassword"
    }
    ```

#### **2. User Routes**
- **Profile:**
  - Endpoint: `GET /api/users/account`

### **Testing Tools:**
- Use **Postman** or **cURL** to test the API endpoints.

---

## **Conclusion**
Following this guide, you should be able to set up and run the backend of the "Voices of Change" application successfully. If you encounter issues not covered here, ensure to double-check configurations and consult the documentation of the tools used.

