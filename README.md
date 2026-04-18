# 🛍️ Trendova Shop — Full-Stack E-Commerce Platform

Trendova Shop is a **full-stack e-commerce platform** that simulates a real-world online shopping system, allowing users to browse products, manage carts, make purchases, and track orders seamlessly.

This project was built to understand **end-to-end e-commerce architecture**, including authentication, payments, order management, and real-time user interactions.


## 🌐 Live Demo
Frontend:  https://trendova-shop.vercel.app
Backend API: https://trendova-shop.onrender.com 


## ✨ Key Features

### 🛍️ Shopping Experience
- Dynamic product browsing with category filtering  
- Interactive product cards with modern UI  
- Wishlist system for saving products  
- Fully responsive design for mobile and desktop  


### 🛒 Cart & Orders
- Add/remove items with quantity control  
- Persistent cart system  
- Order creation and tracking system  
- Order history with status updates  


### 💳 Payments & Transactions
- Secure payment gateway integration  
- Purchase flow from cart → checkout → order confirmation  
- Transaction handling and tracking  


### 🔐 Authentication & Security
- User registration and login system  
- JWT-based authentication  
- Protected routes for authenticated users  
- Secure backend architecture with Express  


### 🔔 Notifications System
- Real-time user notifications  
- Order updates and system alerts  
- Improved user engagement and feedback  


### ⚡ Backend System
- RESTful API built with Node.js & Express  
- Database integration for users, products, and orders  
- Order management and transaction logic  
- Scalable backend structure for real-world applications  


## ⚙️ Tech Stack

### Frontend
- **React**  
- **Vite**  
- **Tailwind CSS**  
- **Context API**  

## frontend set up
- cd frontend
- npm install

Create .env:
- VITE_API_URL=http://localhost:5000/api
- VITE_CLOUDINARY_CLOUD_NAME=your_clouldname
- VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudpreset
- VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_vite_key


### Backend
- **Node.js**  
- **Express.js**  
- **MongoDB**  
- **JWT Authentication**  

## backend set up
- PORT=5000
- MONGO_URI=your_mongo_uri
- JWT_ACCESS_SECRET=*********
- JWT_REFRESH_SECRET=***********
- JWT_ACCESS_EXPIRES=***
- JWT_REFRESH_EXPIRES=**

- npm run dev

## 🔐 Environment Setup
Copy the example environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

🧠 What I Learned
- Building a complete full-stack e-commerce system
- Designing secure authentication flows with JWT
- Implementing real-world payment and order systems
- Managing frontend + backend integration
- Structuring scalable MERN applications
👤 Author: Obaro — Full-Stack Developer (JavaScript / MERN)

⭐ Why This Project Matters

This project demonstrates:
- Real-world e-commerce system design
- Strong full-stack development skills
- Backend architecture & API design
- Secure authentication & transaction handling
- End-to-end product development

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Emmirez/trendova_shop.git
cd trendova-shop

📄 License
This project is proprietary. All rights reserved © 2026 DevClosure.