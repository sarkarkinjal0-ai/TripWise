import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownUp, ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Compass,
  Globe2, Heart, Leaf, LoaderCircle, MapPin, Menu, Search, ShieldCheck,
  Sparkles, Trash2, X, Clock3, ExternalLink, Plane, SlidersHorizontal
} from "lucide-react";

const API = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const categories = [
  { value: "all", label: "All places" },
  { value: "city", label: "Cities" },
  { value: "nature", label: "Nature" },
  { value: "culture", label: "Culture & history" },
  { value: "landmark", label: "Landmarks" }
];
const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80";

function getTripId() {
  let id = localStorage.getItem("tripwise-trip-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("tripwise-trip-id", id);
  }
  return id;
}
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Trip-Id": getTripId(),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed. Please try again.");
  return data;
}
function categoryLabel(value) {
  return categories.find(c => c.value === value)?.label || "Explore";
}
function shortText(text = "", max = 150) {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

function Brand({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="TripWise home">
    <span className="brand-mark"><Compass size={21} strokeWidth={2.3}/></span>
    <span>tripwise<span className="brand-period">.</span></span>
  </button>;
}

function DestinationCard({ item, saved, onDetails, onSave }) {
  return <article className="destination-card">
    <button className="card-image-button" onClick={() => onDetails(item)} aria-label={`View ${item.title} details`}>
      <img className="card-image" src={item.image || fallbackImage} alt={item.title} loading="lazy"
        onError={e => { e.currentTarget.src = fallbackImage; }} />
      <span className="image-chip">{categoryLabel(item.category)}</span>
    </button>
    <div className="card-content">
      <div className="card-title-row">
        <button className="card-title" onClick={() => onDetails(item)}>{item.title}</button>
        <button className={`icon-button save-small ${saved ? "is-saved" : ""}`} onClick={() => onSave(item)}
          title={saved ? "Already in My Trip" : "Add to My Trip"} aria-label={saved ? "Already saved" : "Save destination"}>
          {saved ? <Check size={17}/> : <Bookmark size={17}/>}
        </button>
      </div>
      <p className="card-description">{shortText(item.description, 122)}</p>
      <div className="card-footer">
        <span className="muted-meta"><MapPin size={13}/> {item.location || "Explore the world"}</span>
        <button className="text-link" onClick={() => onDetails(item)}>Explore <ArrowRight size={14}/></button>
      </div>
    </div>
  </article>;
}

function DetailModal({ item, saved, onClose, onSave }) {
  useEffect(() => {
    const close = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <button className="modal-close" onClick={onClose} aria-label="Close details"><X size={20}/></button>
      <div className="detail-image-wrap">
        <img src={item.image || fallbackImage} alt={item.title} onError={e => { e.currentTarget.src = fallbackImage; }}/>
        <span className="image-chip detail-chip">{categoryLabel(item.category)}</span>
      </div>
      <div className="detail-body">
        <p className="eyebrow"><MapPin size={14}/> YOUR NEXT DISCOVERY</p>
        <h2 id="detail-title">{item.title}</h2>
        <p className="detail-description">{item.description || "Explore this destination and discover what makes it special."}</p>
        <div className="detail-source"><Globe2 size={16}/><span>Destination information provided by Wikimedia</span></div>
        <div className="detail-actions">
          <button className={`button-primary ${saved ? "button-saved" : ""}`} onClick={() => onSave(item)}>
            {saved ? <Check size={17}/> : <Bookmark size={17}/>} {saved ? "Added to My Trip" : "Add to My Trip"}
          </button>
          <a className="button-secondary" href={item.url} target="_blank" rel="noreferrer">Read more <ExternalLink size={15}/></a>
        </div>
      </div>
    </section>
  </div>;
}

function EmptyState({ trip = false, onExplore }) {
  return <div className="empty-state">
    <div className="empty-icon">{trip ? <Plane size={28}/> : <Search size={28}/>}</div>
    <h3>{trip ? "Your next adventure starts here" : "No places found"}</h3>
    <p>{trip ? "Save places that catch your eye and they’ll be waiting here when you return." : "Try another search or switch up your filters to discover more places."}</p>
    {trip && <button className="button-primary" onClick={onExplore}>Explore destinations <ArrowRight size={16}/></button>}
  </div>;
}

export default function App() {
  const [view, setView] = useState("explore");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [destinations, setDestinations] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripLoading, setTripLoading] = useState(true);
  const [error, setError] = useState("");
  const [tripError, setTripError] = useState("");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchRef = useRef(null);

  const loadDestinations = useCallback(async (search = submittedQuery, cat = category, order = sort) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: search, category: cat, sort: order, limit: "18" });
      const data = await request(`/api/destinations?${params}`);
      setDestinations(data.items || []);
    } catch (e) {
      setError(e.message || "We couldn’t load destinations. Please try again.");
      setDestinations([]);
    } finally { setLoading(false); }
  }, [submittedQuery, category, sort]);

  const loadItinerary = useCallback(async () => {
    setTripLoading(true);
    setTripError("");
    try {
      const data = await request("/api/itinerary");
      setItinerary(data.items || []);
    } catch (e) {
      setTripError(e.message || "We couldn’t load your trip.");
    } finally { setTripLoading(false); }
  }, []);

  useEffect(() => { loadDestinations("", "all", "relevance"); loadItinerary(); }, []);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 3200);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const savedIds = useMemo(() => new Set(itinerary.map(i => i.id || i.title)), [itinerary]);
  const saved = item => savedIds.has(item.id || item.title);

  async function addDestination(item) {
    if (saved(item)) { setNotice(`${item.title} is already in My Trip.`); return; }
    try {
      const response = await request("/api/itinerary", { method: "POST", body: JSON.stringify(item) });
      setItinerary(prev => [...prev, response.item]);
      setNotice(`${item.title} added to My Trip.`);
    } catch (e) {
      if (e.message.toLowerCase().includes("already")) await loadItinerary();
      setNotice(e.message);
    }
  }
  async function removeDestination(item) {
    try {
      await request(`/api/itinerary/${encodeURIComponent(item.id || item.title)}`, { method: "DELETE" });
      setItinerary(prev => prev.filter(i => (i.id || i.title) !== (item.id || item.title)));
      setNotice(`${item.title} removed from My Trip.`);
    } catch (e) { setTripError(e.message); }
  }
  function openDetails(item) { setSelected(item); }
  async function openFullDetails(item) {
    setSelected(item);
    try {
      const full = await request(`/api/destinations/${encodeURIComponent(item.title)}`);
      setSelected(current => current?.title === item.title ? full : current);
    } catch { /* Keep the usable card details if the details endpoint is temporarily unavailable. */ }
  }
  function goTo(next) {
    setView(next);
    setMobileMenu(false);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function submitSearch(e) {
    e.preventDefault();
    setSubmittedQuery(query.trim());
    loadDestinations(query.trim(), category, sort);
  }
  function changeCategory(value) {
    setCategory(value);
    loadDestinations(submittedQuery, value, sort);
  }
  function changeSort(value) {
    setSort(value);
    loadDestinations(submittedQuery, category, value);
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="topbar-inner">
        <Brand onClick={() => goTo("explore")}/>
        <nav className={`nav-links ${mobileMenu ? "nav-open" : ""}`} aria-label="Main navigation">
          <button className={`nav-link ${view === "explore" ? "active" : ""}`} onClick={() => goTo("explore")}>Explore</button>
          <button className={`nav-link trip-nav ${view === "trip" ? "active" : ""}`} onClick={() => goTo("trip")}>
            My Trip <span className="nav-count">{itinerary.length}</span>
          </button>
        </nav>
        <div className="header-right">
          <span className="header-note"><ShieldCheck size={15}/> Your trip, your way</span>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle navigation">{mobileMenu ? <X/> : <Menu/>}</button>
          <button className="header-trip-button" onClick={() => goTo("trip")}><Bookmark size={16}/> My Trip <span>{itinerary.length}</span></button>
        </div>
      </div>
    </header>

    <main>
      {view === "explore" ? <>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14}/> MAKE ROOM FOR WONDER</span>
            <h1>Find your<br/><em>somewhere.</em></h1>
            <p className="hero-subtitle">Little-known corners. Iconic views. Places that stay with you. Your next great story starts here.</p>
            <form className="search-box" onSubmit={submitSearch}>
              <Search size={19} className="search-icon"/>
              <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Where do you want to go?" aria-label="Search destinations"/>
              {query && <button type="button" className="clear-search" onClick={() => { setQuery(""); setSubmittedQuery(""); loadDestinations("", category, sort); }} aria-label="Clear search"><X size={16}/></button>}
              <button type="submit" className="search-submit">Discover <ArrowRight size={16}/></button>
            </form>
            <div className="hero-footnote"><span className="live-dot"/> Discover somewhere new today <span className="footnote-separator">·</span> Powered by Wikimedia</div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo"><img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85" alt="Colorful coastal Italian village" /></div>
            <div className="floating-note"><span className="floating-icon"><MapPin size={17}/></span><span><strong>Somewhere beautiful</strong><small>Waiting to be discovered</small></span><Heart size={17} className="floating-heart"/></div>
            <div className="hero-stamp"><Compass size={23}/><span>GO<br/>BEYOND</span></div>
          </div>
          <div className="hero-scribble" aria-hidden="true">✳</div>
        </section>

        <section className="explore-section page-container">
          <div className="section-heading">
            <div><p className="eyebrow">THE WORLD IS YOURS</p><h2>Places to fall for<span className="accent-dot">.</span></h2><p className="section-description">Find the places you’ll be thinking about long after you get home.</p></div>
            <div className="results-note"><Globe2 size={16}/> Destinations from around the world</div>
          </div>
          <div className="filter-toolbar">
            <div className="category-tabs" role="group" aria-label="Filter by category">
              {categories.map(c => <button key={c.value} className={`category-tab ${category === c.value ? "selected" : ""}`} onClick={() => changeCategory(c.value)}>{c.label}</button>)}
            </div>
            <label className="sort-control"><ArrowDownUp size={15}/><span>Sort:</span>
              <select value={sort} onChange={e => changeSort(e.target.value)} aria-label="Sort destinations">
                <option value="relevance">Recommended</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option>
              </select><ChevronDown size={14} className="select-chevron"/>
            </label>
          </div>
          {error && <div className="error-banner"><span>{error}</span><button onClick={() => loadDestinations()}>Try again</button></div>}
          {loading ? <div className="loading-state"><LoaderCircle className="spinner" size={28}/><p>Finding your next favourite place…</p></div>
            : destinations.length === 0 ? <EmptyState onExplore={() => { setQuery(""); setSubmittedQuery(""); setCategory("all"); loadDestinations("", "all", sort); }}/>
            : <div className="destination-grid">{destinations.map((item, index) => <DestinationCard key={item.id || `${item.title}-${index}`} item={item} saved={saved(item)} onDetails={openFullDetails} onSave={addDestination}/>)}</div>}
          <div className="source-note">Destination descriptions and images are sourced from <a href="https://www.wikipedia.org/" target="_blank" rel="noreferrer">Wikimedia / Wikipedia</a>. Information may vary by article.</div>
        </section>
      </> : <section className="trip-page page-container">
        <div className="trip-heading">
          <button className="back-link" onClick={() => goTo("explore")}><ArrowLeft size={16}/> Back to exploring</button>
          <div className="trip-title-line"><div><p className="eyebrow"><Plane size={14}/> YOUR PERSONAL COLLECTION</p><h1>My <em>Trip.</em></h1><p className="section-description">A little collection of places you want to see in the world.</p></div>
            <div className="trip-counter"><span>{itinerary.length.toString().padStart(2, "0")}</span><small>{itinerary.length === 1 ? "PLACE SAVED" : "PLACES SAVED"}</small></div>
          </div>
        </div>
        {tripError && <div className="error-banner"><span>{tripError}</span><button onClick={loadItinerary}>Try again</button></div>}
        {tripLoading ? <div className="loading-state"><LoaderCircle className="spinner" size={28}/><p>Gathering your saved places…</p></div>
          : itinerary.length === 0 ? <EmptyState trip onExplore={() => goTo("explore")}/>
          : <div className="trip-layout">
            <div className="trip-list">
              {itinerary.map((item, index) => <article className="trip-item" key={item.id || item.title}>
                <div className="trip-item-number">{String(index + 1).padStart(2, "0")}</div>
                <button className="trip-item-image" onClick={() => openFullDetails(item)}><img src={item.image || fallbackImage} alt={item.title} onError={e => { e.currentTarget.src = fallbackImage; }}/></button>
                <div className="trip-item-copy"><span className="trip-category">{categoryLabel(item.category)}</span><button className="trip-item-title" onClick={() => openFullDetails(item)}>{item.title}</button><p>{shortText(item.description, 125)}</p><a href={item.url} target="_blank" rel="noreferrer">Read destination guide <ExternalLink size={13}/></a></div>
                <button className="remove-button" onClick={() => removeDestination(item)} aria-label={`Remove ${item.title}`} title="Remove from My Trip"><Trash2 size={17}/></button>
              </article>)}
            </div>
            <aside className="trip-summary"><div className="summary-icon"><Compass size={23}/></div><p className="eyebrow">THE BEGINNING OF SOMETHING</p><h3>Your world,<br/>your way.</h3><p>Every great journey starts with a place that makes you curious. Keep collecting yours.</p><div className="summary-divider"/><div className="summary-stat"><span>Places on your list</span><strong>{itinerary.length}</strong></div><div className="summary-stat"><span>Saved for later</span><strong>∞</strong></div><button className="button-primary summary-button" onClick={() => goTo("explore")}>Find another place <ArrowRight size={16}/></button><small className="persistence-note"><Check size={13}/> Your list is saved to the database</small></aside>
          </div>}
      </section>}
    </main>

    <footer className="footer">
      <div className="footer-inner"><Brand onClick={() => goTo("explore")}/><p>Made for the places that make you feel something.</p><div className="footer-right"><span><Leaf size={14}/> Travel curious</span><span>© 2026 TripWise</span></div></div>
    </footer>

    {notice && <div className="toast" role="status"><span className="toast-check"><Check size={15}/></span><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {selected && <DetailModal item={selected} saved={saved(selected)} onClose={() => setSelected(null)} onSave={addDestination}/>}
  </div>;
}
