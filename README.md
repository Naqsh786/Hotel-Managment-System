<div align="center">

# 🏨 Hotel Management System (MERN Stack)

### A Premium, Full-Stack Hotel Management Platform for Guests, Staff, & Admins

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

<br/>

**Role-Based Access** · **Real-Time Live Chat** · **Stripe Payments** · **Chart.js Analytics** · **Cloudinary Image Uploads**

<br/>

[🐛 Report Bug](https://github.com/Naqsh786/Hotel-Managment-System/issues) · [✨ Request Feature](https://github.com/Naqsh786/Hotel-Managment-System/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About The Project

A comprehensive and scalable **MERN stack-based Hotel Management System** designed to streamline hotel operations, enhance guest experience, and provide powerful administrative tools. This system supports three primary user roles: **Admin**, **Staff**, and **Guest**, each with their own dedicated dashboards, functionalities, and real-time interactions.

---

## 🌟 Key Features

### 👤 Guest (User) Features
| Feature | Description |
|---|---|
| 🛏️ **Room Browsing** | View available rooms, filter by type, and check details |
| 💳 **Room Booking** | Real-time room booking with **Stripe** secure payments |
| 📱 **Guest Dashboard** | Manage profile, view booking history, and active reservations |
| 🛎️ **Service Requests** | Request room cleaning, maintenance, laundry, or reception services |
| 🍔 **Food Ordering** | Browse the food menu and order food directly to the room |
| 💬 **Live Chat** | Real-time chat with hotel staff/reception (Powered by **Socket.io**) |
| ⭐ **Reviews & Ratings** | Share feedback and rate room experiences |

### 👥 Staff Features (Role-Based Access)
| Feature | Description |
|---|---|
| 👔 **Role Dashboards** | Interfaces for Manager, Receptionist, Security, Housekeeping, Room Service, etc. |
| 🚶 **Walk-in Bookings** | Receptionists can handle walk-in guest registrations and bookings |
| 📋 **Task Management** | View, accept, and update the status of assigned service requests |
| 🚪 **Room Status** | Track real-time status of rooms (Available, Booked, Cleaning, Maintenance) |
| 🧑‍🤝‍🧑 **Guest Management** | View current guests and their details |
| 🍲 **Food Inventory** | Manage food availability and orders |

### 👑 Admin Features
| Feature | Description |
|---|---|
| 📈 **Admin Dashboard** | Comprehensive overview with real-time statistics and charts (**Chart.js**) |
| 🏨 **Room Management** | Add/edit rooms, manage amenities, and upload images (**Cloudinary**) |
| 📅 **Booking Management** | Oversee all hotel bookings, manage cancellations, and track revenue |
| 🔐 **User Management** | Create staff accounts, assign specific roles/shifts, and manage all users |
| 💰 **Financials** | View earnings, payment histories, and revenue charts |
| ⚙️ **System Settings** | Configure home page settings, addons, and general hotel info |

---

## 🚀 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### 🖥️ Frontend (Client)
- **React.js 18** + **Vite 5**
- **Redux Toolkit** (State Management)
- **React Router Dom 6** (Routing)
- **Framer Motion** (Animations)
- **Socket.io-client** (Real-time Features)
- **Chart.js** & **React-chartjs-2** (Visualizations)
- **React Hook Form** (Form Validation)
- **Lucide React** (Icons)

</td>
<td valign="top" width="50%">

### ⚙️ Backend (Server)
- **Node.js** & **Express.js 5** (API Framework)
- **MongoDB** & **Mongoose 9** (Database)
- **Socket.io** (WebSockets for Real-time Chat)
- **JWT** (Authentication & Authorization)
- **Stripe** (Payment Gateway)
- **Cloudinary** & **Multer** (Image Uploads)
- **Nodemailer** (Email Notifications)
- **Bcrypt.js** (Password Hashing)

</td>
</tr>
</table>

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cloud)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Naqsh786/Hotel-Managment-System.git
cd Hotel-Managment-System
```

### 2️⃣ Backend Setup

```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Open .env and fill in your actual values (see Environment Variables section below)

# Start the backend server
npm start
```

### 3️⃣ Frontend Setup

```bash
# Open a new terminal and navigate to the client folder
cd client

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start the frontend dev server
npm run dev
```

> 💡 **Tip:** The frontend runs on `http://localhost:5173` and the backend on `http://localhost:7000` by default.

---

## 🔐 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `7000` |
| `DATABASE` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hoteldb` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_jwt_secret_key` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret | `your_cloudinary_api_secret` |
| `EMAIL_USER` | Email for Nodemailer | `your_email@gmail.com` |
| `EMAIL_PASS` | Email App Password | `your_email_app_password` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:7000` |

---

## 📁 Project Structure

```
Hotel-Managment-System/
├── server/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers for routes
│   ├── middlewares/     # Authentication & role authorization
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express API routes
│   ├── utils/           # Helper functions
│   ├── app.js           # Express app setup
│   ├── server.js        # Server start (local dev)
│   ├── seed.js          # Database seeder
│   └── vercel.json      # Vercel deployment config
│
├── client/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Admin, Staff, Guest)
│   │   ├── Features/    # Redux slices for state management
│   │   └── context/     # React Contexts (Socket, Toast)
│   ├── index.html       # Entry HTML
│   └── vercel.json      # Vercel SPA config
│
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Feel free to check the [Issues Page](https://github.com/Naqsh786/Hotel-Managment-System/issues).

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by [Naqsh786](https://github.com/Naqsh786)

</div>
