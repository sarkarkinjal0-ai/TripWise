# TripWise — Smart Travel Planner
**Track:** 3 — Full-Stack Development  
**Built with:** React, Vite, Node.js, Express, PostgreSQL, Wikimedia API

TripWise lets users discover destinations from a real external API, search/filter/sort results, view destination details, and save or remove places from a persistent itinerary.

## Architecture
- `frontend/`: React + Vite responsive single-page application.
- `backend/`: Express REST API, Wikimedia API integration, PostgreSQL persistence and request validation.
- Wikimedia's public MediaWiki API supplies destination search results, descriptions, thumbnails and article links. No Wikimedia API key is required.
- PostgreSQL stores itinerary items. A browser-generated trip ID separates one browser's itinerary from another's; it is not an authentication system.

## Features
- Destination discovery from Wikipedia/Wikimedia (real external API).
- Search plus category filters and sorting.
- Destination detail modal/page with image, description and source link.
- Add, list and remove itinerary items, persisted in PostgreSQL.
- Loading, empty, network-error and validation feedback.
- Responsive desktop/mobile layout.
- Health endpoint and basic API security/rate limiting.
- API documentation below.

## Requirements
- Node.js 20 or newer
- PostgreSQL database (local PostgreSQL or hosted PostgreSQL such as Neon)
- npm

## Run locally

### 1. Configure PostgreSQL
Create a database, for example `tripwise`. Set `DATABASE_URL` to your connection string.

### 2. Backend
In the `backend` folder:
```bash
npm install
```
Copy `.env.example` to `.env`, then fill in `DATABASE_URL` and `FRONTEND_ORIGIN`.
```bash
npm run dev
```
The API runs at `http://localhost:5000`. On startup it creates the required table automatically.

### 3. Frontend
In a separate terminal, enter the `frontend` folder:
```bash
npm install
```
Copy `.env.example` to `.env` (the default points to the local backend).
```bash
npm run dev
```
Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Deployment

### Database
Create a PostgreSQL database with a provider such as Neon. Copy its connection string. Keep credentials private.

### Backend (Render or another Node host)
- Create a Web Service from the GitHub repository.
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `DATABASE_URL`: hosted PostgreSQL connection string
  - `FRONTEND_ORIGIN`: deployed frontend origin, e.g. `https://your-site.vercel.app`
  - `NODE_ENV`: `production`
  - `PORT`: set automatically by many hosts; do not hard-code it
- If your PostgreSQL provider requires TLS, the backend enables TLS for hosted database URLs.
- After deploy, check `https://YOUR-BACKEND-URL/health`.

### Frontend (Vercel or Netlify)
- Import the same repository.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_BASE_URL` with your deployed backend URL, e.g. `https://your-api.onrender.com` (no trailing slash).
- Redeploy after setting the environment variable.

**Important:** the frontend URL and backend URL must be added to the correct environment variables. The backend CORS origin must exactly match your deployed frontend origin.

## REST API

All endpoints are prefixed with `/api`.

### `GET /health`
Returns service status and whether the database is reachable.
Example response:
```json
{ "status": "ok", "database": "connected" }
```

### `GET /api/destinations?q=kyoto&category=all&sort=relevance&page=1&limit=12`
Searches Wikimedia and returns normalized destination cards.
- `q`: search phrase (optional; default search is travel destinations)
- `category`: `all`, `city`, `nature`, `culture`, or `landmark`
- `sort`: `relevance`, `name-asc`, or `name-desc`
- `page`: positive integer
- `limit`: 1–24

Example response:
```json
{
  "items": [
    {
      "id": "Kyoto",
      "title": "Kyoto",
      "description": "Kyoto is a city in Japan...",
      "image": "https://...",
      "url": "https://en.wikipedia.org/wiki/Kyoto",
      "category": "city",
      "location": "Explore the world"
    }
  ],
  "page": 1,
  "limit": 12,
  "total": 12,
  "source": "Wikimedia"
}
```
`total` is the number of items returned by this API call, not a global count of all matching Wikipedia articles.

### `GET /api/destinations/:title`
Retrieves one article's details from Wikimedia. URL-encode the title.

### `GET /api/itinerary`
Returns itinerary items for the browser's trip ID. Send `X-Trip-Id: <UUID>`.

### `POST /api/itinerary`
Adds a destination to the itinerary. Send `X-Trip-Id: <UUID>` and JSON:
```json
{
  "id": "Kyoto",
  "title": "Kyoto",
  "description": "A historic city in Japan.",
  "image": "https://upload.wikimedia.org/...",
  "url": "https://en.wikipedia.org/wiki/Kyoto",
  "category": "city",
  "location": "Japan"
}
```
Returns `201` when added, `409` if already saved, or `400` for invalid data.

### `DELETE /api/itinerary/:title`
Removes an item by URL-encoded Wikipedia title. Requires `X-Trip-Id`.

## Submission checklist from the task PDF
- [ ] Public GitHub repository with source code
- [ ] Live deployed website and API
- [ ] README with overview, track, technologies, API details, setup and database configuration
- [ ] PDF screenshots of Explore, Destination Details, My Trip, and mobile views
- [ ] Screenshots of search/filter results, populated itinerary, and empty state
- [ ] Use required filename: `<register no>_fullstack.pdf` (confirm exact naming convention with the organizer if uncertain)

## Screenshot/PDF instructions
After deploying or running locally, capture real screenshots of:
1. Explore page with cards.
2. Search/filter results.
3. A destination detail view.
4. My Trip with at least two saved places.
5. My Trip empty state (remove all saved items).
6. Mobile Explore view using browser device emulation.
7. Mobile My Trip view.

Put the screenshots into a document, export it as PDF, and use the required filename. Do not submit placeholder screenshots.

## Notes and limitations
- Wikimedia content is community-maintained; descriptions and images may vary by article.
- Category filtering uses a transparent keyword-based heuristic over article titles and descriptions, not an authoritative taxonomy.
- Trip IDs are anonymous browser identifiers, not secure user accounts. Do not store sensitive personal data.
- Public API limits and availability may change; the UI displays errors when the external service is unavailable.
