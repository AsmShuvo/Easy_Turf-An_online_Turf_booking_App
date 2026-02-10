# EasyTurf 🏟️

**Tactical Arena Deployment & Management System**

EasyTurf is a high-performance, full-stack web application designed for seamless sports turf booking and management. It bridges the gap between arena owners (Admins) and players (Users) through a sleek, tactical interface and a robust real-time architecture.

---

## 🚀 Key Features

### 🛡️ For Admins (Command Center)

- **Arena Management**: Register new turfs with detailed amenities, pricing and locations.
- **Operational Overview**: Real-time dashboard to monitor pending and confirmed bookings.
- **Dynamic Scheduling**: Automated slot management that prevents double-bookings at the database level.
- **Mission Control**: Confirm or decline bookings with immediate user notifications.
- **Analytics**: Advanced analytics dashboard tracking revenue trajectory, peak hours and weekly engagement.

### ⚽ For Users (Arena Operation)

- **Tactical Search**: Filter arenas by city, date and available time slots.
- **Secure Booking**: Integrated payment flow with transaction verification.
- **Mission Logs**: Complete history of past and upcoming bookings with status tracking.
- **Identity Security**: Firebase-powered authentication synchronized with a dedicated PostgreSQL user profile.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework**: React.js + Vite
- **Data Fetching**: TanStack Query (React Query)
- **Visualization**: Recharts
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + Tactical Dark UI
- **Icons**: Lucide React
- **Authentication**: Firebase Auth SDK
- **Alerts**: SweetAlert2

### Backend (Server)

- **Environment**: Node.js + Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Architecture**: Modular Controller/Route structure

---

## 📉 Database ER Diagram

![ER Diagram](https://raw.githubusercontent.com/AsmShuvo/Easy_Turf-An_online_Turf_booking_App/refs/heads/main/Client/public/images/ER.PNG)

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/AsmShuvo/Easy_Turf-An_online_Turf_booking_App.git
cd Easy_Turf
```

### 2. Backend Configuration

```bash
cd Server
npm install
```

Create a `.env` file in the `Server` directory:

```env
DATABASE_URL="your_postgresql_connection_string"
PORT=3000
```

Run migrations:

```bash
npx prisma migrate dev
```

### 3. Frontend Configuration

```bash
cd ../Client
npm install
```

Create a `.env` file in the `Client` directory:

```env
VITE_SERVER_URL="http://localhost:3000"
# Add your Firebase Config
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
# ... etc
```

### 4. Run the Operation

Open two terminals:

- **Server**: `npm start`
- **Client**: `npm run dev`

---

## 📄 License

This project is licensed under the ISC License.

Developed by **AsmShuvo**
