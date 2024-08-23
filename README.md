# 📝 **Task Master**

A comprehensive task management system that helps users manage their tasks effectively with features like categorization, secure authentication, and responsive design.

## **Table of Contents**

1. [📄 Project Overview](#📄-project-overview)
2. [✨ Features](#✨-features)
3. [🛠 Tech Stack](#🛠-tech-stack)
4. [⚙️ Installation and Setup](#installation-and-setup)
5. [🚀 Usage](#🚀-usage)
6. [🔗 API Endpoints](#🔗-api-endpoints)
7. [📂 Folder Structure](#📂-folder-structure)
8. [🤝 Contributing](#🤝-contributing)
9. [📬 Contact](#📬-contact)


## 📄 **Project Overview**

Task Master is a task management application designed to help users create, edit, delete, and categorize tasks. It offers secure user authentication and a responsive interface to enhance productivity.

## ✨ **Features**
- **Task Management:** Create, edit, delete, and categorize tasks (due, overdue, completed).
- **User Authentication:** Secure login and registration system. Users only see their task data.
- **Responsive Design:** Optimized for all devices, ensuring a seamless experience.

## 🛠 **Tech Stack**

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


## ⚙️ **Installation and Setup**

### **Prerequisites**

- Node.js (v14.x or higher)
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