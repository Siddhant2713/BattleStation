# BattleStation

BattleStation is a modern 3D web application that combines a high-performance React frontend with a Node.js/Express backend. It features immersive 3D visualizations using Three.js and a robust API for authentication and component management.

## 🚀 Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **3D Graphics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Authentication:** JWT (JSON Web Tokens)
- **Data:** In-memory mock data (easily extensible to MongoDB/SQL)

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

## 📦 Installation

1. Clone the repository (if applicable).
2. Install all dependencies (root, frontend, and backend) with a single command:

```bash
npm run install:all
```

## ⚙️ Configuration

### Frontend
Create a `.env.local` file in the `frontend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend
Create a `.env` file in the `backend/` directory (optional, defaults provided):

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

## ▶️ Running the Application

Start both the frontend and backend servers concurrently from the root directory:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📂 Project Structure

```
BattleStation/
├── frontend/          # React + Vite application
│   ├── src/           # Source code (components, 3D scenes, etc.)
│   └── ...
├── backend/           # Express API
│   ├── controllers/   # Route controllers
│   ├── models/        # Data models (Mock)
│   ├── routes/        # API routes
│   └── server.js      # Entry point
└── package.json       # Root scripts
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests.
