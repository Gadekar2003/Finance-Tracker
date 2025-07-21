# 💰 Personal Finance Tracker

## 🧾 Introduction

The Personal Finance Tracker is a full-stack web application that helps users track their income and expenses, categorize them, and analyze their financial data through insightful charts and summaries. It empowers individuals to manage their money wisely, set budgeting goals, and stay in control of their financial health.

---

## 🛠 Project Type
**Fullstack** (Frontend + Backend + Database)

---

## 🚀 Deployed App

- **Frontend**: [https://your-frontend-url.com](https://your-frontend-url.com)
- **Backend**: [https://your-backend-url.com](https://your-backend-url.com)
- **Database**: MongoDB Atlas

---

## 📁 Directory Structure

my-finance-tracker/
├── backend/ # Node.js + Express API
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── index.js
│
├── frontend/ # Next.js + React UI
│ ├── components/
│ ├── pages/
│ ├── styles/
│ ├── utils/
│ ├── public/
│ ├── app/


---

## 🎥 Video Walkthrough

- **Features Demo (1-3 min)**: [Watch Video](https://link-to-your-feature-demo)
- **Codebase Overview (1-5 min)**: [Watch Video](https://link-to-your-code-demo)

---

## 🌟 Features

- ✅ User authentication and authorization
- ✅ Add, edit, and delete income and expenses
- ✅ Category-wise breakdown of income/expenses
- ✅ Monthly summary chart (income vs expenses)
- ✅ Dashboard with visual insights
- ✅ Fully responsive design (Mobile + Desktop)
- ✅ JWT token-based secure APIs

---

## 🧠 Design Decisions & Assumptions

- Used **MongoDB** for flexible document-based data and easy aggregation
- Used **ShadCN + Tailwind CSS** for a consistent, accessible UI
- Used **Moment.js** for date formatting
- Backend API was kept RESTful for reusability and scalability
- Authentication is handled with token-based JWTs

---

## 🧪 Installation & Getting Started

### Backend

```bash
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm run dev
🔐 Credentials (for demo)

Email: demo@example.com
Password: 123456

📡 API Endpoints
Base URL: /api

Authentication
METHOD	ENDPOINT	DESCRIPTION
POST	/auth/register	Register new user
POST	/auth/login	Login and get token

Income APIs
METHOD	ENDPOINT	DESCRIPTION
GET	/income	Get all incomes (user-based)
POST	/income	Add new income
DELETE	/income/:id	Delete income by ID

Expense APIs
METHOD	ENDPOINT	DESCRIPTION
GET	/expense	Get all expenses
POST	/expense	Add new expense
DELETE	/expense/:id	Delete expense by ID

Meta APIs
METHOD	ENDPOINT	DESCRIPTION
GET	/meta	Get monthly/category stats

🧰 Technology Stack
Frontend:
Next.js – React framework for SSR and routing

React – Component-based UI

Tailwind CSS – Utility-first styling

ShadCN – Accessible and styled UI components

Chart.js / Recharts – For data visualization

Lucide Icons – For modern icons

Backend:
Node.js – JavaScript runtime

Express.js – Lightweight web framework

MongoDB – NoSQL database

Mongoose – MongoDB ODM

Moment.js – Date manipulation

JWT – For secure authentication

