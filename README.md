# 🚀 Portfolio Management System

A modern full-stack Portfolio Management System built with the MERN Stack that enables users to create, manage, and showcase their professional portfolio through an intuitive dashboard. The application provides secure authentication, project and skill management, portfolio analytics, activity tracking, and responsive user experiences across all devices.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)

---

## 🌐 Live Demo

🔗 **Application:** [http://localhost:3000/dashboard](#)

---

## 📖 Overview

The Portfolio Management System is designed to help developers, freelancers, designers, and professionals manage their personal portfolio from a centralized dashboard. Users can maintain their profile, showcase projects, manage skills, organize project categories, and monitor portfolio activities in real time.

---

## ✨ Key Features

### 🔐 Authentication & Security

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Secure Password Hashing with bcrypt
* Persistent User Sessions

### 👤 Profile Management

* Update Personal Information
* Manage About Section
* Contact Information Management
* Profile Image Upload Support
* Portfolio Preview

### 🛠 Skills Management

* Add New Skills
* Update Existing Skills
* Delete Skills
* Dynamic Skill Display

### 📁 Project Management

* Create Projects
* Edit Project Details
* Delete Projects
* Assign Categories
* Portfolio Showcase

### 🏷 Category Management

* Create Categories
* Edit Categories
* Delete Categories
* Organize Projects Efficiently

### 📊 Dashboard & Analytics

* Interactive Dashboard
* Statistics Overview
* Skills Count
* Projects Count
* Categories Count
* Recent Activity Monitoring

### 📸 Media Uploads

* Profile Image Upload
* Multer Integration
* File Management Support

### 🔍 Search & Filtering

* Search Projects by Title
* Filter Projects by Category
* Faster Project Discovery

### 📱 Responsive Design

* Mobile Friendly
* Tablet Compatible
* Desktop Optimized
* Modern User Interface

### 📋 Activity Tracking

* Track User Actions
* View Recent Activities
* Clear Activity History
* Real-Time Updates

---

## 🛠 Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Font Awesome
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js
* Multer

### Database

* MongoDB Atlas / Local MongoDB

---

## 📂 Project Structure

```bash
portfolio-management-system/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Before running the project, ensure you have:

* Node.js (v14+)
* npm or yarn
* MongoDB Local Server or MongoDB Atlas

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Muhammad-Salman123/portfolio-management-system.git

cd portfolio-management-system
```

### 2️⃣ Backend Setup

```bash
cd backend

npm install

node server.js
```

Backend Server:

```bash
http://localhost:5000
```

### 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend Application:

```bash
http://localhost:3000
```

### 4️⃣ Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/portfolioDB

JWT_SECRET=your_secret_key_here
```

---

## 📡 REST API Endpoints

### Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

### Profile

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | /api/profile              | Get Profile          |
| PUT    | /api/profile              | Update Profile       |
| POST   | /api/profile/upload-image | Upload Profile Image |

### Skills

| Method | Endpoint        | Description  |
| ------ | --------------- | ------------ |
| GET    | /api/skills     | Get Skills   |
| POST   | /api/skills     | Create Skill |
| PUT    | /api/skills/:id | Update Skill |
| DELETE | /api/skills/:id | Delete Skill |

### Projects

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/projects     | Get Projects   |
| POST   | /api/projects     | Create Project |
| PUT    | /api/projects/:id | Update Project |
| DELETE | /api/projects/:id | Delete Project |

### Categories

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | /api/categories     | Get Categories  |
| POST   | /api/categories     | Create Category |
| PUT    | /api/categories/:id | Update Category |
| DELETE | /api/categories/:id | Delete Category |

### Activities

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | /api/activities       | Get Activities       |
| DELETE | /api/activities/clear | Clear All Activities |


## 👨‍💻 Author

**Muhammad Salman**

* GitHub: https://github.com/Muhammad-Salman123
* LinkedIn: https://www.linkedin.com/in/muhammad-salman-6630152a9/
* Email: msalmank1131@gmail.com

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub. Your support helps improve and maintain the project.
