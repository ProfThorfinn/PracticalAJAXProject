# 📚 Advanced Library Management System (Backend API)

## 📝 Overview

This is a comprehensive RESTful API for a **Library Management System**. It handles complex logic for book inventory, user authentication, and borrowing workflows. The system is designed with a focus on security, scalability, and clean code architecture, bridging the gap between local development and cloud-based data persistence.

---

## 🛠 Architecture & Tech Stack

* **Runtime Environment:** `Node.js`
* **Web Framework:** `Express.js`
* **Database:** `MongoDB Atlas` (Cloud Cluster)
* **Object Data Modeling (ODM):** `Mongoose`
* **Authentication:** `JSON Web Tokens (JWT)` for stateless auth.
* **Security:** `Bcrypt.js` for industrial-grade password hashing.
* **Environment Management:** `dotenv` for securing API keys and credentials.

---

## ✨ Key Features

### 🔐 Security & Auth

* **User Registration:** Validates and stores user data with hashed passwords.
* **JWT Login:** Issues a secure token upon successful authentication.
* **Protected Routes:** Ensures only authorized users can borrow or return books.

### 📖 Book Management

* **Dynamic Inventory:** Real-time tracking of book availability.
* **Categorization:** Books are tagged with multiple categories for easier filtering.
* **Seeding System:** Includes a standalone script to populate the database with realistic technical data.

### 🔄 Borrowing Workflow

* **Atomic Transactions:** Logic to ensure a book's status changes only when a valid user is assigned.
* **User History:** Tracks which user has borrowed which specific book.

---

## 📂 Project Structure

```text
PracticalAJAXProject/
├── backend/
│   ├── models/          # Mongoose Schemas (Book, User)
│   ├── routes/          # API Route definitions
│   ├── data/            # JSON seed files
│   ├── .env             # Environment variables (Ignored by Git)
│   ├── seeder.js        # Script to populate Atlas DB
│   └── server.js        # Entry point / Express App
├── vercel.json          # Deployment configuration
└── README.md            # You are here!

```

---

## 🚀 Getting Started

### Prerequisites

* Node.js installed.
* A MongoDB Atlas account and cluster.

### Setup Instructions

1. **Clone & Install:**
```bash
git clone https://github.com/ProfThorfinn/PracticalAJAXProject.git
cd backend
npm install

```


2. **Environment Setup:**
Create a `.env` file in the `backend` folder:
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=MAHMOUD_XP_SECRET

```


3. **Database Seeding:**
Populate your cloud database with the provided dataset:
```bash
node seeder.js

```


4. **Run Development Server:**
```bash
npm run dev

```



---

## 🧪 API Documentation (Endpoints)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new account | ❌ |
| `POST` | `/api/auth/login` | Get JWT Token | ❌ |
| `GET` | `/api/books` | Fetch all books | ❌ |
| `GET` | `/api/books/:id` | Fetch single book details | ❌ |
| `POST` | `/api/books/borrow/:id` | Borrow a book | ✅ |
| `POST` | `/api/books/return/:id` | Return a book | ✅ |

---
