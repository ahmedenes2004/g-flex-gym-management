# G-Flex Gym Management System

This is a Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application developed for the BLG330 Web Programming term project. 

## Features
- **Authentication**: JWT-based user login and registration with Role-Based Access Control (Admin vs Member).
- **Class Management**: View schedule, enroll in classes, and admin controls to add/remove classes.
- **Payment Tracking**: Record member payments and membership plans securely.
- **Modern UI**: Developed with a custom CSS design system using glassmorphism, smooth animations, and premium dark mode.
- **Responsive Design**: Works perfectly across mobile, tablet, and desktop views.

## Technologies Used
- **Frontend**: React.js (via Vite), React Router DOM, Axios, Custom CSS.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB.
- **Security**: bcrypt (password hashing), jsonwebtoken (auth).

## Project Structure
- `backend/`: RESTful API, Models, Controllers, Routes.
- `frontend/`: React components, pages, context API, and styling.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd "web teknolojileri bahar dönemi proje"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Make sure MongoDB is running locally or set MONGO_URI in .env
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/classes` - List all classes
- `POST /api/classes` - Create a class (Admin)
- `PUT /api/classes/:id/enroll` - Enroll in a class
- `GET /api/payments` - View payments

## Documentation & Diagrams
*This section is reserved for UML Diagrams (Use-case, Activity, ER) as required by the project.*

> Note: For the grading, use the `npm start` in the backend and `npm run dev` in the frontend to boot up the complete system.
