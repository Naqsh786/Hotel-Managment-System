# 🏨 Full-Stack Hotel Management System

A comprehensive and scalable MERN stack based Hotel Management System designed to streamline hotel operations, enhance guest experience, and provide powerful administrative tools. This system supports three primary user roles: **Admin**, **Staff**, and **Guest**, each with their own dedicated dashboards and functionalities.

## 🌟 Key Features

### 👤 Guest (User) Features
- **Browse & Search Rooms:** View available rooms, filter by type, and check details.
- **Room Booking:** Real-time room booking with Stripe payment integration.
- **Guest Dashboard:** Manage profile, view booking history, and active reservations.
- **Service Requests:** Request room cleaning, maintenance, laundry, or reception services directly from the dashboard.
- **Food Ordering:** Browse the food menu and order food to the room.
- **Live Chat:** Real-time chat with hotel staff/reception for instant support (Powered by Socket.io).
- **Reviews & Ratings:** Share feedback and rate room experiences.

### 👥 Staff Features (Role-Based Access)
- **Role-Specific Dashboards:** Different interfaces for Manager, Receptionist, Security, Housekeeping, Room Service, etc.
- **Walk-in Bookings:** Receptionists can handle walk-in guest registrations and bookings.
- **Task Management:** View, accept, and update the status of assigned service requests (cleaning, food, maintenance).
- **Room Status Monitoring:** Track real-time status of rooms (Available, Booked, Cleaning, Maintenance).
- **Guest Management:** View current guests and their details.
- **Food Inventory:** Manage food availability and orders.

### 👑 Admin Features
- **Admin Dashboard:** Comprehensive overview with real-time statistics and charts (Chart.js).
- **Room Management:** Add, edit, or remove rooms, upload room images (Cloudinary integration), and manage amenities.
- **Booking Management:** Oversee all hotel bookings, manage cancellations, and track revenue.
- **User & Staff Management:** Create staff accounts, assign specific roles and shifts, and manage all users.
- **Financials:** View earnings, payment histories, and revenue charts.
- **System Settings:** Configure home page settings, addons, and general hotel information.

## 🛠️ Technology Stack

### Frontend (Client)
- **React.js** (v18)
- **Redux Toolkit** (State Management)
- **React Router Dom** (Routing)
- **Framer Motion** (Animations)
- **Socket.io-client** (Real-time features)
- **Chart.js & React-chartjs-2** (Data Visualization)
- **Vite** (Build Tool)

### Backend (Server)
- **Node.js & Express.js** (API framework)
- **MongoDB & Mongoose** (Database & ODM)
- **Socket.io** (WebSockets for Real-time chat & notifications)
- **JWT (JSON Web Tokens)** (Authentication & Authorization)
- **Stripe** (Payment Gateway Integration)
- **Cloudinary & Multer** (Image upload and storage)
- **Nodemailer** (Email notifications)

## 🚀 Installation & Setup

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (Local or MongoDB Atlas)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/Naqsh786/Hotel-Managment-System.git
cd Hotel-Managment-System
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory by copying the `.env.example` file:
```bash
cp .env.example .env
```
Fill in the required variables in the newly created `.env` file.
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory by copying the `.env.example` file:
```bash
cp .env.example .env
```
Start the Vite development server:
```bash
npm run dev
```

## 📁 Project Structure

- `/client`: React frontend code.
  - `/src/components`: Reusable UI components.
  - `/src/pages`: Page views (AdminPages, StaffPages, Guest pages).
  - `/src/Features`: Redux slices for state management.
  - `/src/context`: React Contexts (Socket, Toast).
- `/server`: Node.js backend code.
  - `/models`: Mongoose database schemas.
  - `/controllers`: Request handlers for routes.
  - `/routes`: Express API routes.
  - `/middlewares`: Authentication and role authorization middlewares.
  - `/config`: Database and other configuration files.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is licensed under the ISC License.
