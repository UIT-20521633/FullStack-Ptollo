# FullStack-Ptollo

# PTollo Project – Team and Project Management Tool

### Overview

PTollo is a web-based project management tool designed to streamline task organization and enhance team collaboration. It offers features such as task tracking, real-time communication, video conferencing, and project progress visualization, making it ideal for both personal and team projects.

---

## Features

### Frontend

- **User Authentication**: Secure sign-up and login system with real-time validation.
- **Project Management**:
  - Create and manage boards, lists, and tasks.
  - Add labels, set deadlines, and attach files to tasks.
  - Drag-and-drop functionality for organizing tasks and lists.
- **Collaboration Tools**:
  - Real-time chat and video calls with **Socket.io** integration.
  - Add comments, assign members, and tag tasks for efficient teamwork.
- **Customizable UI**: Personalize boards and tasks with background themes.
- **Progress Visualization**: Track project completion using interactive visual charts.

### Backend

- **RESTful API**: Built with **Express.js**, supporting CRUD operations for boards, tasks, users, and comments.
- **Database Management**: Integrated **MongoDB** for scalable and efficient data storage.
- **Authentication & Authorization**: Secured with **JWT (JSON Web Tokens)** and role-based access control.
- **Real-Time Updates**: Implemented live notifications, chat, and video conferencing using **Socket.io**.
- **Testing & Debugging**: Verified API functionality and reliability with **Postman**.

---

## Technologies Used

### Frontend

- React.js
- MUI (Material-UI)
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.io
- Postman

---

## Installation and Setup

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- **MongoDB** running locally or on a cloud service.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/UIT-20521633/PTollo_PJ_Api.git
   git clone https://github.com/UIT-20521633/PTollo_Pj_UIT.git
   ```
2. Navigate to each folder and install dependencies:
   ```bash
   cd PTollo_PJ_Api
   npm install
   cd ../PTollo_Pj_UIT
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the backend project folder with variables like `MONGO_URI`, `JWT_SECRET`, and `PORT`.
4. Start the backend and frontend servers:
   - **Backend**:
     ```bash
     cd PTollo_PJ_Api
     npm start
     ```
   - **Frontend**:
     ```bash
     cd PTollo_Pj_UIT
     npm start
     ```
5. Open your browser and navigate to `http://localhost:3000` (or the specified frontend port).

---

## Usage

- Sign up or log in to access the application.
- Create projects, add tasks, and invite team members.
- Use the chatbox and video call features for real-time communication.
- Track project progress through the visual dashboard.

---

## Future Improvements

- AI-powered project recommendations and task prioritization.
- Advanced filtering and sorting options for tasks and projects.
- Improved templates for project boards.

---

## Contributors

- **Nguyễn Tấn Phương Nam**

---

## License

This project is licensed under the MIT License.
