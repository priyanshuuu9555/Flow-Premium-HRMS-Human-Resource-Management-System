# Flow Premium HRMS – Human Resource Management System

A full-stack Human Resource Management System (HRMS) designed to simplify employee operations, attendance tracking, leave management, and workforce administration through a modern and responsive web interface.

## Overview

Flow Premium HRMS is a web-based workforce management application built using React, TypeScript, Tailwind CSS, and Django. It provides an integrated platform for managing employee information, tracking attendance, handling leave requests, and monitoring workforce activities through a centralized dashboard.

The application follows a frontend-backend architecture, with React handling the user interface and Django managing backend operations and application data.

## Key Features

### 1. Authentication
- User login and registration functionality.
- Authentication-related API integration.
- Secure handling of user credentials.

### 2. Employee Management
- Manage employee information.
- Organize employee records.
- Support employee-related administrative operations.

### 3. Attendance Management
- Track employee attendance.
- Manage attendance records.
- Monitor workforce attendance activities.

### 4. Leave Management
- Manage employee leave requests.
- Track leave information and records.
- Simplify leave administration.

### 5. Dashboard & Analytics
- Centralized HR dashboard.
- Workforce overview and activity monitoring.
- Visual presentation of HR-related information.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Python, Django |
| Database | SQLite |
| API | REST API |
| Build Tool | Vite |
| Version Control | Git, GitHub |

## Project Architecture

The application follows a modular frontend-backend architecture.

```text
FlowPremiumHRMS/
│
├── backend/
│   ├── accounts/
│   ├── attendance/
│   ├── config/
│   ├── employees/
│   ├── jobs/
│   ├── leaves/
│   ├── db.sqlite3
│   └── manage.py
│
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js and npm
- Python 3.10 or later
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/priyanshuuu9555/Flow-Premium-HRMS-Human-Resource-Management-System.git

cd Flow-Premium-HRMS-Human-Resource-Management-System
```

### 2. Frontend Setup

```bash
npm install
npm run dev
```

The frontend development server will start using Vite. Open the local URL displayed in your terminal.

### 3. Backend Setup

Open another terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the backend dependencies listed in the project's requirements file:

```bash
pip install -r requirements.txt
```

Apply database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

Note: The backend setup assumes a `requirements.txt` file is included. If it is not present, generate one from the working environment using `pip freeze > requirements.txt` before publishing the final setup instructions.

## Learning Outcomes

- Full-stack application development using React and Django.
- Building modular and reusable frontend components.
- Backend development and REST API integration.
- Database management using SQLite.
- Authentication and application workflow implementation.
- Version control and project management using Git and GitHub.

## Future Enhancements

- Role-based access control.
- Advanced employee analytics and reporting.
- Payroll management.
- Performance management.
- Automated HR notifications.
- Improved application testing and deployment.

## Author

**Priyanshu Kumar Singh**

B.Tech – Computer Science and Engineering

- GitHub: https://github.com/priyanshuuu9555
- Project Repository: https://github.com/priyanshuuu9555/Flow-Premium-HRMS-Human-Resource-Management-System

---

*Developed as a full-stack software engineering project using React, TypeScript, Django, and SQLite.*
