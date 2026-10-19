<div align="center">

# ✈️ TripWise

### Discover places. Design your journey. Keep every stop in one place.

**A full-stack travel discovery and itinerary planner built to make exploring the world feel effortless.**

<p>
  <a href="https://tripwise-frontend-omega.vercel.app/"><strong>🌐 Live Website</strong></a>
  &nbsp; • &nbsp;
  <a href="https://tripwise-backend-scl5.onrender.com/"><strong>⚙️ Backend API</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/sarkarkinjal0-ai/TripWise"><strong>💻 Source Code</strong></a>
</p>

![Track](https://img.shields.io/badge/Track-Full--Stack-635BFF?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=20232A)

</div>

---

## 🌍 Project Overview

TripWise is a full-stack travel discovery web application that helps users explore destinations and assemble a personal trip itinerary. Browse destination cards, search for places, narrow results by category, sort destinations alphabetically, open destination details, and add or remove places from **My Trip**.

The application combines a responsive React interface with a Node.js/Express backend and a Neon-hosted PostgreSQL database. The frontend and backend are deployed separately for a live, accessible experience.

> **Project submission**
>
> - **Register number:** `26BCE1313`
> - **Chosen track:** Full Stack
> - **Submission filename:** `26BCE1313_Full_Stack.pdf` *(for the required screenshots PDF)*

## 🔗 Live Links

| Resource | Link |
|---|---|
| **Live application** | [tripwise-frontend-omega.vercel.app](https://tripwise-frontend-omega.vercel.app/) |
| **Backend deployment** | [tripwise-backend-scl5.onrender.com](https://tripwise-backend-scl5.onrender.com/) |
| **Backend health check** | [Open `/health`](https://tripwise-backend-scl5.onrender.com/health) |
| **GitHub repository** | [sarkarkinjal0-ai/TripWise](https://github.com/sarkarkinjal0-ai/TripWise) |

The backend health endpoint has been tested and returned a healthy status with the database connected.

## ✨ Features

- **Explore destinations** — browse destination cards and images.
- **Search** — find destinations by name.
- **Category filters** — narrow results by categories such as City, Nature, Culture, and Landmark.
- **Alphabetical sorting** — sort results A–Z or Z–A.
- **Destination details** — view a destination's name, description, image, and related Wikipedia page.
- **My Trip itinerary** — add destinations to an itinerary and remove them when plans change.
- **Persistent itinerary experience** — itinerary entries remained available after refresh in the tested browser.
- **Responsive UI** — desktop and mobile layouts for exploring and managing a trip.
- **Backend health check** — verify API availability and database connectivity.

## 🧰 Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| Frontend | React, Vite, JavaScript, CSS | Interactive, responsive user interface |
| Backend | Node.js, Express.js | Server and API |
| Database | PostgreSQL on Neon | Relational database service |
| Destination content | Wikipedia API | Destination reference content and links |
| Frontend hosting | Vercel | Live frontend deployment |
| Backend hosting | Render | Live API deployment |

## 🔌 API Details

### Health check

**Endpoint:** `GET https://tripwise-backend-scl5.onrender.com/health`

Use this endpoint to check whether the backend is running and whether it can connect to the configured database.

Example request:

```bash
curl https://tripwise-backend-scl5.onrender.com/health
```

Example successful response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

### Destination data

TripWise uses destination content associated with the Wikipedia API. Search, category filtering, and sorting are available through the application interface.

> **API route note:** The health route above is verified. For any additional backend endpoints, request parameters, or response schemas, refer to the current source code in [`backend/src/index.js`](https://github.com/sarkarkinjal0-ai/TripWise/blob/master/backend/src/index.js) rather than assuming undocumented routes.

## 🚀 Run Locally

### Prerequisites

Install:
- [Node.js](https://nodejs.org/) (includes npm)
- Git
- Access to a PostgreSQL database, such as [Neon](https://neon.tech/)

### 1. Clone the repository

```bash
git clone https://github.com/sarkarkinjal0-ai/TripWise.git
cd TripWise
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create a local environment file using the variable names expected by the backend code and configure the PostgreSQL connection string. Then run the start script defined in `backend/package.json`.

For example, if the project defines a `start` script:

```bash
npm start
```

If it defines a development script instead, use the script listed in `backend/package.json`.

### 3. Start the frontend

Open a **second terminal** from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal (commonly `http://localhost:5173`).

### 4. Verify the backend

Once the backend is running, open its `/health` endpoint or run:

```bash
curl http://localhost:<BACKEND_PORT>/health
```

Replace `<BACKEND_PORT>` with the port configured by the backend.

## 🗄️ Database Configuration

TripWise uses **PostgreSQL hosted on Neon**.

1. Create or open a Neon project and copy its PostgreSQL connection string.
2. Configure the backend's database connection using the environment-variable name expected by the source code.
3. Keep credentials in a local environment file or your deployment provider's environment settings.
4. For Render, add the database configuration under the backend service's environment variables.
5. Redeploy the backend after changing deployment environment variables.
6. Verify connectivity using `GET /health`.

**Security:** Never commit `.env` files, database passwords, access tokens, or other secrets to GitHub. Keep a `.env.example` file with placeholder values only, if useful.

## ☁️ Deployment

| Component | Platform | Deployment |
|---|---|---|
| Frontend | Vercel | [Open live site](https://tripwise-frontend-omega.vercel.app/) |
| Backend | Render | [Open backend](https://tripwise-backend-scl5.onrender.com/) |
| Database | Neon | PostgreSQL service configured for the backend |

If you fork or redeploy the project, configure the frontend's backend URL and the backend's allowed frontend origin for the new deployment domains.

## 🧪 Validation Notes

The deployed application has been manually tested for destination browsing, search, most category filters, alphabetical sorting, destination details, itinerary add/remove, persistence after refresh, responsive mobile views, and backend/database health.

**Known limitation:** The Landmark filter displayed “No places found” when used without a search term during testing; searching for Eiffel Tower and selecting Landmark did return a result. This can be revisited in the category-classification logic.

## 📁 Repository Structure

```text
TripWise/
├── frontend/       # React + Vite application
├── backend/        # Node.js + Express API
└── README.md       # Project documentation
```

*This is a high-level overview; consult the repository for the complete file structure.*

## 👤 Project Information

**Project:** TripWise  
**Track:** Full Stack  
**Register Number:** `26BCE1313`  
**Repository:** [github.com/sarkarkinjal0-ai/TripWise](https://github.com/sarkarkinjal0-ai/TripWise)

---

<div align="center">

**Made for curious travelers — one destination at a time.** 🌎

[Explore TripWise](https://tripwise-frontend-omega.vercel.app/) · [View Source Code](https://github.com/sarkarkinjal0-ai/TripWise)

</div>
