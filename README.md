# 📚 Full-Stack Library Management System

## 📝 Project Overview

This is a **Full-Stack** application designed to manage a library's book inventory. It bridges a modern, responsive **Frontend** built with Vanilla JavaScript and AJAX with a powerful **Node.js/Express Backend** connected to a cloud-based **MongoDB Atlas** database.

---

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla AJAX/Fetch API).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud Cluster).
* **ORM/ODM:** Mongoose.
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt for password security.

---

## ✨ Key Features

* **Asynchronous Operations:** Real-time data fetching and updates using AJAX without page reloads.
* **Cloud Persistence:** All books and user data are stored securely on MongoDB Atlas.
* **Secure Auth:** Full registration/login system with encrypted passwords.
* **Borrowing System:** Logical checks for book availability and user borrowing history.
* **Automated Seeding:** A dedicated script to populate the database with a technical book catalog.

---

## 📂 Project Structure

```text
PracticalAJAXProject/
├── Frontend/              # Client-Side Application (UI)
│   ├── index.html           # Initial Entry Point
│   ├── landing.html         # Main Dashboard (Book Display)
│   ├── login.html           # User Authentication Page
│   ├── register.html        # New User Registration
│   ├── profile.html         # User Profile View
│   ├── user.html            # User Management Interface
│   └── javascript.js        # Core AJAX Logic & API Consumption
│
├── backend/               # Server-Side Application (API)
│   ├── app.js               # Express Application Logic
│   ├── server.js            # Server Entry Point & Port Listener
│   ├── db.js                # MongoDB Atlas Connection Setup
│   ├── book.js              # Book Model & Schema
│   ├── user.js              # User Model & Schema
│   ├── seeder.js            # Database Population Script
│   ├── books.json           # Raw Seed Data
│   ├── .env                 # Environment Variables (Private)
│   ├── .gitignore           # Backend-specific ignore rules
│   └── README.md            # Backend documentation
│
├── 📄 .gitignore             # Root ignore rules (node_modules, etc.)
├── 📄 README.md              # Main Project Documentation (You are here)
├── 📄 package.json           # Project dependencies & scripts
└── 📄 package-lock.json      # Dependency lock file

```
---

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS version recommended).
* MongoDB Atlas Cluster URI.

### Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/ProfThorfinn/PracticalAJAXProject.git

```


2. **Setup Backend:**
```bash
cd backend
npm install

```


3. **Environment Variables:**
Create a `.env` file inside the `backend/` folder:
```env
PORT=3000
MONGO_URI=your_atlas_connection_string
JWT_SECRET=MAHMOUD_XP_SECRET

```


4. **Seed the Cloud Database:**
```bash
node seeder.js

```


5. **Start the Engine:**
```bash
node server.js

```



---

## 🧪 API Endpoints (Documentation)

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Secure login | ❌ |
| `GET` | `/api/books` | Get all books from Atlas | ❌ |
| `POST` | `/api/books/borrow/:id` | Borrow a book | ✅ |
| `POST` | `/api/books/return/:id` | Return a book | ✅ |

---
