# 🎬 Movie Booking System

A full‑stack web application for browsing movies, booking tickets, managing user accounts, and submitting reviews.
Built with **React (frontend)** and **Django REST Framework (backend)**.

---

## 🌟 Features

### 🎟️ User Features
- Browse **Current**, **Upcoming**, and **All** Movies
- View detailed movie information
- Book tickets with seat confirmation
- Submit and view reviews & ratings
- Manage profile (name, email, phone)
- View order history and past bookings
- Secure login & registration system

### 👨‍💼 Admin Features
- Add / Edit / Delete Movies
- Manage Theaters & Shows
- Manage Tickets and Payments
- Moderate Reviews

---

## 🧱 Tech Stack

### **Frontend**
- React + Vite
- React Router
- Context API for state management
- Custom UI components (cards, modals, forms)

### **Backend**
- Django
- Django REST Framework
- SQLite (local) / PostgreSQL (production)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```
git clone https://github.com/DEX-01-CODER/movie-booking-system
cd movie-booking-system
```

---

## 🖥️ Start Backend (Django)
```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 💻 Start Frontend (React)
```
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure
```
movie-booking-system/
│
├── backend/
│   └── api/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── migrations/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🔒 Security Notes
- Do NOT commit `.env` files
- API keys / secrets must stay local
- Always test before pushing changes

---

## 📬 Contributing
This project is mainly for coursework & personal learning.
If you want to help, feel free to open issues or PRs.

---

## 👨‍💻 Authors
- Rushikesh Reddy Bayyapu
- Austin Perez
- Ethan Spillman
- Eitan Holdeman
- Abhimnayu Karki

**Movie Booking System — Full-Stack Implementation**
