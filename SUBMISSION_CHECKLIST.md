# TripWise submission checklist

## Before deployment
- [ ] Create a PostgreSQL database and keep its URL private.
- [ ] Configure `backend/.env` from `backend/.env.example`.
- [ ] Configure `frontend/.env` from `frontend/.env.example`.
- [ ] Run both services locally.
- [ ] Test search, category filters, sorting, details, add/remove, refresh persistence, empty state, and errors.
- [ ] Check mobile layout in browser responsive mode.

## Deploy
- [ ] Deploy `backend/` to a Node host.
- [ ] Add `DATABASE_URL`, `FRONTEND_ORIGIN`, and `NODE_ENV=production` to backend environment.
- [ ] Verify `/health` says database connected.
- [ ] Deploy `frontend/` to a static host.
- [ ] Set `VITE_API_BASE_URL` to the backend URL and rebuild.
- [ ] Set `FRONTEND_ORIGIN` to the exact frontend origin and redeploy backend.
- [ ] Test the live website in a private/incognito browser window.

## Evidence required by the task PDF
- [ ] Explore page
- [ ] Destination details view
- [ ] My Trip populated with destinations
- [ ] Search/filter results
- [ ] Empty itinerary state
- [ ] Mobile Explore view
- [ ] Mobile My Trip view
- [ ] Put screenshots into a PDF with the filename requested by the organizers.
- [ ] Public GitHub repository
- [ ] Live frontend URL and backend API URL
- [ ] README reviewed for accuracy
