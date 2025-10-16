A full-stack Learning Management System built with MERN stack.
Users can enroll in a single course — “Introduction to Machine Learning” — after completing a test payment.
The course contains videos and documents, and users can summarize any PDF using Gemini 2.0 Flash AI.


Features

Form-based user registration (no login needed)

Razorpay test payment (₹500) for course access

Pre-seeded course data stored in MongoDB Atlas

Watch videos and read documents inside LMS

“Summarize with AI” button for PDFs using Gemini Flash

Fully responsive frontend (Bootstrap + React)

Tech Stack

Frontend: React  + Bootstrap + Axios

Backend: Node.js + Express + MongoDB (Mongoose)

AI Integration: Google Gemini 2.0 Flash

Payment: Razorpay (test mode)

Hosting: Render (backend) and Vercel (frontend)


backend .env

PORT=5001
MONGO_URI=mongodb_atlas_url
RAZORPAY_KEY_ID=test_key
RAZORPAY_KEY_SECRET=test_secret
GEMINI_API_KEY=gemini_api_key

Frontend .env

REACT_APP_RAZORPAY_KEY_ID=test_key


Flow

User fills the form

Pays ₹500 via Razorpay test mode

After verification → redirected to the course

Watches videos or reads PDFs

Clicks Summarize with AI → Gemini Flash summarizes instantly


Deployment

Backend: Deploy on Render 

Frontend: Deploy  on Vercel

Use MongoDB Atlas as the database

Add all .env variables to your hosting environment

