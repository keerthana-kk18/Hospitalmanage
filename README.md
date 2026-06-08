# Medicare - MERN Stack Hospital Management system


## 📖 Project Overview
Medicare is a full-stack MERN application designed to streamline the hospital management process. The platform provides a seamless experience for patients to search for specialist doctors and manage their appointment bookings.

---

## Key Features
* Advanced Doctor Search: Patients can easily search for specialists by name or category.

* Streamlined Scheduling: Users can view available doctor time slots and manage their consultations.

* Secure Authentication: * User Login and Signup functionality.

* Independent password visibility toggles (Eye Icons) for "Password" and "Confirm Password" fields for a better user experience.

* Responsive Design: * Fully adaptive layout that works across mobile, tablet, and desktop devices.

* Professional, clean UI using Tailwind CSS.

* Secure API Integration: CORS-protected backend ensuring safe communication between the Vercel-hosted frontend and the Render-hosted backend.

---

## Technologies Used
* Frontend: React.js, Vite, Tailwind CSS, React Icons, Axios.

* Backend: Node.js, Express.js.

* Database: MongoDB with Mongoose ODM.

* Deployment: Vercel (Frontend), Render (Backend).

---

## Setup Instructions
* **Clone the Project**
git clone[https://github.com/keerthana-kk18/Hospitalmanage.git]

* **Backend Configuration**
  1.Navigate to the backend: cd backend
  2.Install dependencies: npm install
  3.Start the server: npm start
 
* **Frontend Configuration**
  1.Navigate to the frontend: cd frontend
  2.Install dependencies: npm install
  3.Run the application: npm run dev

  ---

  ## Folder Structure
Hospitalmanage/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── multer.js
│   ├── controllers/
│   │   ├── admincontroller.js
│   │   ├── bookingcontroller.js
│   │   ├── doctorcontroller.js
│   │   ├── schedulecontroller.js
│   │   └── usercontroller.js
│   ├── middleware/
│   │   └── authmiddleware.js
│   ├── models/
│   │   ├── booking.js
│   │   ├── doctor.js
│   │   ├── schedule.js
│   │   └── users.js
│   ├── routes/
│   │   ├── adminroutes.js
│   │   ├── bookingroutes.js
│   │   ├── doctorroutes.js
│   │   ├── scheduleroutes.js
│   │   └── userroutes.js
│   ├── utils/
│   │   └── generatetoken.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Userhome.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Medicalrecords.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Adddoctor.jsx
│   │   │   ├── Admindashboard.jsx
│   │   │   ├── Allpatients.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Doctorappointments.jsx
│   │   │   ├── Doctordashboard.jsx
│   │   │   ├── Doctoredit.jsx
│   │   │   ├── Doctorprofile.jsx
│   │   │   ├── Doctorview.jsx
│   │   │   ├── Managedoctor.jsx
│   │   │   └── Schedandavailability.jsx
│   │   └── images/
│   ├── tailwind.config.js
│   └── main.jsx
└── README.md

---

## Live Demo
* **Frontend Application:** [https://hospitalmanage-vvv4-phi.vercel.app/]
* **Backend API:** [https://hospitalmanage-1.onrender.com]
