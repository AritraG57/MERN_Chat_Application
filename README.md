# 💬 Chatty - Real-Time Chat Application

A modern **full-stack real-time chat application** built using the **MERN Stack** and **Socket.IO**. Chatty enables seamless one-to-one and group conversations with secure authentication, real-time messaging, media sharing, and an intuitive user interface.

---

## 🚀 Live Demo

🔗 **Live Demo:** [Chatty](https://mern-chat-application-efru.onrender.com/)

---

## ✨ Features

### 🔐 Authentication & Authorization

* Secure user authentication using **JWT**
* HTTP-only cookies for enhanced security
* Protected backend routes
* Persistent user sessions

### 💬 Real-Time Messaging

* Instant one-to-one messaging
* Real-time message synchronization using **Socket.IO**
* Live online/offline user status
* Persistent chat history

### 👥 Groups

* Create new groups
* Add members to groups
* Remove members from groups
* Role-based group administration
* Group conversations in real time

### 🤝 Friend Management

* Add friends
* Remove friends
* Friend request management

### 🖼️ Media Sharing

* Upload and share images
* Cloudinary integration for image storage

### 🎨 User Interface

* Responsive design
* Modern chat interface
* Theme support
* User profile management

### ⚡ Performance

* Efficient global state management using Zustand
* Optimized API usage
* Modular frontend architecture

---

# 🛠️ Tech Stack

## Frontend

* React
* Zustand
* Tailwind CSS
* DaisyUI
* Axios
* React Router DOM
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication
* Cookie Parser
* Cloudinary

---

# 📂 Project Structure

```
Chatty/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── lib/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/AritraG57/MERN_Chat_Application.git
```

```bash
cd MERN_Chat_Application
```

---

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5001

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET

NODE_ENV=development
```

---

# ▶️ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 📌 API Highlights

### Authentication

* User Signup
* User Login
* User Logout
* Authentication Check
* Update Profile

### Chat

* Send Messages
* Fetch Messages
* Real-Time Messaging
* Image Sharing

### Groups

* Create Group
* Add Members
* Remove Members
* Group Messaging

### Friends

* Add Friend
* Remove Friend
* Friend Requests

---

# 🔒 Security

* JWT Authentication
* HTTP-only Cookies
* Protected Routes
* Password Hashing using bcrypt
* Secure User Sessions

---

# 📈 Future Enhancements

* Read Receipts
* Typing Indicators
* Message Reactions
* Voice Messages
* Video Calling
* Push Notifications
* Message Search
* Emoji Reactions
* File Sharing
* Message Editing & Deletion

---

# 👨‍💻 Author

**Aritra Ghosh**

GitHub: https://github.com/AritraG57

LinkedIn: https://linkedin.com/in/aritra-ghosh-75372a372

LeetCode: https://leetcode.com/u/aritraghosh2005/

Codeforces: https://codeforces.com/profile/Aritra2005

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.
