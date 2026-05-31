# 🚀 Loan Management System (LMS)

A production-ready Loan Management System built using **Next.js 14**, **TypeScript**, **Express.js**, **MongoDB**, **JWT Authentication**, and **Role-Based Access Control (RBAC)**.

This project simulates the complete lifecycle of a loan application, from borrower onboarding and BRE validation to sanction, disbursement, collection, and closure workflows.

---

# 🌐 Live Demo

### Frontend

https://lms-web-9hyx.onrender.com

### Backend API

https://lms-api-fkz0.onrender.com

---

# 🎥 Project Demo Video

Watch the complete project walkthrough here:

https://drive.google.com/file/d/1gYfhQh_kM_BEgzdkGjl_B0M-GnBdnRZ0/view?usp=sharing

> This video demonstrates the complete Loan Management System workflow, including borrower onboarding, BRE validation, loan processing, role-based approvals, disbursement, collections, and loan closure.

---

# 📂 GitHub Repository

https://github.com/rajrais2004/LMS_System

---

# ✨ Key Features

## Borrower Journey

* User Registration & Login
* JWT Authentication
* Personal Details Submission
* BRE (Business Rule Engine) Validation
* Salary Slip Upload (PDF/JPG/PNG)
* Loan Application Submission
* Real-Time Loan Status Tracking

## Loan Workflow

* Sales Verification
* Sanction Approval
* Loan Disbursement
* Collection Management
* Loan Closure

## Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Protected APIs
* Input Validation
* Secure Password Hashing

## Technical Features

* Next.js App Router
* TypeScript
* Express.js REST APIs
* MongoDB Database
* Mongoose ODM
* Tailwind CSS UI
* Responsive Design
* Audit Logging
* File Upload System
* Docker Support
* Render Deployment

---

# 🏗️ Architecture

```text
Frontend (Next.js)
       │
       ▼
Backend API (Express.js)
       │
       ▼
MongoDB Atlas
```

---

# 👥 User Roles

| Role         | Access                           |
| ------------ | -------------------------------- |
| Borrower     | Apply for loans and track status |
| Sales        | Review loan applications         |
| Sanction     | Approve or reject applications   |
| Disbursement | Disburse approved loans          |
| Collection   | Manage repayments                |
| Admin        | Full system access               |

---

# 🔑 Demo Credentials

## Admin

**Email:** [admin@lms.com](mailto:admin@lms.com)

**Password:** Pass@123

## Sales

**Email:** [sales@lms.com](mailto:sales@lms.com)

**Password:** Pass@123

## Sanction

**Email:** [sanction@lms.com](mailto:sanction@lms.com)

**Password:** Pass@123

## Disbursement

**Email:** [disbursement@lms.com](mailto:disbursement@lms.com)

**Password:** Pass@123

## Collection

**Email:** [collection@lms.com](mailto:collection@lms.com)

**Password:** Pass@123

## Borrower

**Email:** [borrower@lms.com](mailto:borrower@lms.com)

**Password:** Pass@123

---

# 📋 Borrower Flow

```text
Register/Login
      ↓
Personal Details
      ↓
BRE Evaluation
      ↓
Salary Slip Upload
      ↓
Loan Application
      ↓
Status Tracking
```

---

# 📋 Internal Loan Workflow

```text
Sales Review
      ↓
Sanction Approval
      ↓
Disbursement
      ↓
Collection
      ↓
Closure
```

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/rajrais2004/LMS_System.git
cd LMS_System
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create:

```bash
apps/api/.env
```

and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Start Development

```bash
npm run dev
```

---

# 🐳 Docker

```bash
docker compose up --build
```

---

# ☁️ Deployment

The application is deployed on Render.

### Frontend

https://lms-web-9hyx.onrender.com

### Backend

https://lms-api-fkz0.onrender.com

---

# 🛠 Tech Stack

## Frontend

* Next.js 14
* React
* TypeScript
* Tailwind CSS

## Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication

## Database

* MongoDB Atlas
* Mongoose

## Deployment

* Render
* GitHub

---

# 📈 Future Improvements

* Email Notifications
* OTP Verification
* Credit Score Integration
* AWS S3 File Storage
* Payment Gateway Integration
* Advanced Analytics Dashboard

---

# 👨‍💻 Developed By

**Raj Rai**

GitHub: https://github.com/rajrais2004
