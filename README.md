# WasteConnect ♻️

Full-stack waste pickup platform built with React + Vite, Node.js + Express and MongoDB.

## Features
- User and Collector roles
- Register / Login with JWT
- Create recyclable waste pickup requests
- Collector sees pending requests and accepts them
- Collector can mark accepted requests as completed
- User gets reward points on completion
- User pickup history and points
- Collector statistics
- Fully responsive desktop + mobile browser UI

## Run

### Backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Edit `.env`:
MONGO_URI=mongodb://127.0.0.1:27017/wasteconnect
JWT_SECRET=change_this_secret

### Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in terminal.

## Demo
Create two accounts:
1. User role
2. Collector role

Log in as User, create a pickup. Log in as Collector in another browser/incognito window, accept it and complete it. User points update automatically after refresh.

Note: Location is stored as a text address in this starter. No paid maps API is required.
