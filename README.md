# Modifier 🎵

Modifier is an advanced, mood-based music application that uses **real-time Face Detection** to suggest and play songs that match your current mood. 

By seamlessly integrating computer vision (MediaPipe) in the browser with a robust MERN stack backend, Modifier provides a highly interactive and personalized listening experience. 

## ✨ Key Features
*   **Real-time Mood Detection:** Uses your webcam and AI models to detect emotions (Happy, Sad, Angry, Neutral, Surprised, etc.) locally on your device.
*   **Intelligent Music Suggestion:** Automatically maps your detected mood to matching songs from the database.
*   **User Authentication System:** Secure JWT-based login and registration.
*   **Guest Mode:** Let unauthenticated users try out the face-detection feature with a 5-minute listening limit banner before prompting to log in.
*   **Song Upload System:** Users can upload their own tracks and tag them with specific moods to help the algorithm grow!
*   **Responsive & Attractive UI:** Built with Vite, React, SCSS, and GSAP animations for a modern feel.

---

## 🏗️ Architecture & Flow Diagram

The application is built using a modern 4-layer architecture on the frontend (UI -> Hooks -> Context -> API) and a modular MVC pattern on the backend.

```mermaid
flowchart TD
    %% Define styles
    classDef user fill:#6c5ce7,stroke:#fff,stroke-width:2px,color:#fff,rx:10,ry:10;
    classDef frontend fill:#00b894,stroke:#fff,stroke-width:2px,color:#fff,rx:10,ry:10;
    classDef backend fill:#fdcb6e,stroke:#fff,stroke-width:2px,color:#2d3436,rx:10,ry:10;
    classDef database fill:#d63031,stroke:#fff,stroke-width:2px,color:#fff,rx:10,ry:10;
    classDef model fill:#0984e3,stroke:#fff,stroke-width:2px,color:#fff,rx:10,ry:10;

    subgraph User Interaction
    A[User Opens Webcam]:::user --> B[Face Landmarks Detected]:::frontend
    end

    subgraph Client-Side AI (MediaPipe)
    B --> C[Analyze Facial Expressions]:::model
    C --> D[Determine Dominant Mood\ne.g., 'Happy', 'Sad']:::model
    end

    subgraph Frontend Logic (React/Vite)
    D --> E[Update UI State & Context]:::frontend
    E --> F[Trigger API Call for Songs]:::frontend
    end

    subgraph Backend API (Node/Express)
    F -- "GET /api/song/getsong?mood=Happy" --> G[Express Router & Controller]:::backend
    G --> H[Query MongoDB]:::backend
    end

    subgraph Database (MongoDB)
    H --> I[(Song Database)]:::database
    I -- Returns Matching Songs --> H
    end

    subgraph Playback Pipeline
    H -- JSON Response array --> G
    G -- Send Data --> F
    F --> J[React Audio Player Plays Song]:::user
    end
```

---

## 🚀 Tech Stack

### Frontend
*   **React 19** with **Vite** (Blazing fast HMR)
*   **MediaPipe Tasks Vision** (For client-side machine learning / Face Detection)
*   **GSAP** (For smooth and complex animations)
*   **SCSS / Sass** (For robust styling)
*   **React Router v7** (For navigation)

### Backend
*   **Node.js & Express.js** (Server setup and API routing)
*   **MongoDB & Mongoose** (NoSQL Database and ODM)
*   **JWT & bcryptjs** (Secure authentication)
*   **Cors & cookie-parser** (Security and session management)

---

## 💻 Local Setup Instructions

Modifier uses a unified root-level `package.json` to make running both the frontend and backend easier. 

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB local instance or MongoDB Atlas account.

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd Modifier
```

### 2. Set up Environment Variables
Navigate to the `Backend` directory and create a `.env` file based on `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/modifier
JWT_SECRET=your_super_secret_jwt_key
REDIS_HOST=localhost # Optional if using caching
FRONTEND_URL=http://localhost:5173 
```

### 3. Install All Dependencies
From the **root folder**, simply run:
```bash
npm run install-all
```
*(This commands installs node_modules for both `Frontend` and `Backend` directories).*

### 4. Run Development Servers
You will need to run the Frontend and Backend concurrently.

**Terminal 1 (Backend):**
```bash
npm run dev
```
*(Runs the Express server usually on `http://localhost:3000`)*

**Terminal 2 (Frontend):**
Wait for the backend connection, then navigate to `Frontend` and run:
```bash
cd Frontend
npm run dev
```
*(Runs the Vite dev server usually on `http://localhost:5173`)*

---

## 🌍 Production Build & Deployment

To build the application for deployment (e.g., Render, Heroku):

```bash
# This command automatically generates the Vite frontend build 
# and copies it into the Backend's public folder for static serving.
npm run build

# Start the Node process
npm start
``` 

The backend is configured to elegantly serve the `index.html` file as a Single Page Application (SPA) fallback when route matching fails.

---

## 🤝 Contributing
Feel free to open issues or submit Pull Requests for any improvements, new features, or bug fixes!
