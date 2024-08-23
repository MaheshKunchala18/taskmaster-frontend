# 📝 **Task Master**

A comprehensive task management system that helps users manage their tasks effectively with features like categorization, secure authentication, and responsive design.

## **Table of Contents**

1. [📄 Project Overview](#project-overview)
2. [✨ Features](#features)
3. [🛠 Tech Stack](#tech-stack)
4. [⚙️ Installation and Setup](#️installation)
5. [🚀 Usage](#usage)
6. [🔗 API Endpoints](#api-endpoints)
7. [📂 Folder Structure](#folder-structure)
8. [🤝 Contributing](#contributing)
9. [📬 Contact](#contact)


<h2 id="project-overview"> <strong>📄 Project Overview</strong> </h2>

Task Master is a task management application designed to help users create, edit, delete, and categorize tasks. It offers secure user authentication and a responsive interface to enhance productivity.


<h2 id="features"> <strong>✨ Features</strong> </h2>

- **Task Management:** Users can create, edit, delete, and categorize tasks to streamline their workflow.
- **Task Categorization:** Automatically categorizes tasks as Due, Overdue, or Completed to help users prioritize their tasks.
- **User Authentication:** Secure login system ensures that only authorized users can access and manage their tasks.
- **Responsive Design:** Optimized for all devices, ensuring a seamless experience.


<h2 id="tech-stack"> <strong>🛠 Tech Stack</strong> </h2>

### Frontend:

- **React.js**: A powerful JavaScript library for building user interfaces.
- **React Router DOM**: Manages the navigation and routing in the application.
- **React Bootstrap**: Provides pre-styled components, enhancing UI design.
- **React Icons**: Used for implementing scalable vector icons that can be customized easily.
- **Axios**: Handles HTTP requests to communicate with the backend API.
- **Font Awesome**: Provides a wide array of icons for enhancing UI.
- **Testing Library (React, Jest-DOM, User Event)**: Used for unit testing the components to ensure code quality.
- **Web Vitals**: Helps in measuring the core web vitals to monitor the performance of the web application.

### Backend:

- **Node.js**: The runtime environment for running JavaScript on the server-side.
- **Express.js**: A minimal and flexible Node.js web application framework that provides robust features for building APIs.
- **MongoDB**: A NoSQL database used for storing blog posts, user data, and other related information.
- **Mongoose**: A MongoDB object modeling tool designed to work in an asynchronous environment.
- **Body-Parser**: A middleware to handle parsing of incoming request bodies in a middleware before your handlers, available under req.body.
- **Cors**: Middleware that can be used to enable CORS (Cross-Origin Resource Sharing) with various options.
- **Dotenv**: Module to load environment variables from a .env file into process.env.
- **Nodemon**: A utility that monitors for any changes in your source and automatically restarts your server.
- **Mysql2**: A MySQL client for Node.js with a focus on performance, enabling interaction with a MySQL database.

**Note**: The backend uses the ESM module type, enabling the use of "import" statements instead of "require". This aligns the backend with the modern JavaScript syntax, similar to what is used in the React.js frontend.


### Testing

- **Jest & React Testing Library**: Used for unit and integration testing to ensure the application functions as expected.


<h2 id="️installation"> <strong> ⚙️ Installation and Setup</strong> </h2>

### **Prerequisites**

- Node.js (v14.x or higher)
- MySQL (local instance or a remote MySQL server)
- MongoDB (local instance or MongoDB Atlas)
- NPM or Yarn

### **Installation**

1. **Backend Setup:**
   - Clone the repository:
     ```bash
     git clone https://github.com/MaheshKunchala18/taskmaster-backend
     ```
   - Navigate to the backend directory:
     ```bash
     cd taskmaster-backend
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the backend directory and add your environment variables:
     ```bash
     MONGODB_URI=your_mongodb_uri
     PORT=3001
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

2. **Frontend Setup:**
   - Clone the repository:
     ```bash
     git clone https://github.com/MaheshKunchala18/taskmaster-frontend
     ```
   - Navigate to the frontend directory:
     ```bash
     cd taskmaster-frontend
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the frontend directory and add your environment variables:
     ```bash
     REACT_APP_BACKEND_URL=your_backend_url
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

3. **Access the Application:**
   - Open your browser and navigate to `http://localhost:3000`.

<h2 id="usage"> <strong>🚀 Usage</strong> </h2>

- **Home Page:** View popular and trending tasks.
- **Task Management:** Create, edit, delete, and categorize your tasks.
- **Authentication:** Sign up and log in to manage your tasks.


<h2 id="api-endpoints"> <strong>🔗 API Endpoints</strong> </h2>

- **GET /tasks:** Retrieve all tasks.
- **POST /tasks:** Create a new task.
- **PUT /tasks/:id:** Update an existing task.
- **DELETE /tasks/:id:** Delete a task.
- **POST /auth/signup:** Sign up a new user.
- **POST /auth/login:** Log in a user.


<h2 id="folder-structure"> <strong>📂 Folder Structure</strong> </h2>

```bash
TaskMaster/
│
├── backend/
│   ├── Models/
│   ├── node_modules/
│   ├── SQL/
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── Authentication/
│   │   │   ├── Home/
│   │   │   ├── Tasks/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   ├── setupTests.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
```

<h2 id="contributing"> <strong>
🤝 Contributing</strong> </h2>

Contributions are welcome! Please fork this repository and submit a pull request for any features, fixes, or suggestions.


<h2 id="contact"> <strong>📬 Contact</strong> </h2>

For any inquiries or feedback, please contact:

**Mahesh Kunchala**
- LinkedIn: [Mahesh Kunchala](https://linkedin.com/in/mahesh-kunchala-23854624b/)  
- GitHub: [Mahesh Kunchala](https://github.com/MaheshKunchala18)

