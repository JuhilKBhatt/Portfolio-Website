# Portfolio Website

A full-stack portfolio website built with a React + Vite frontend and a Python Flask backend API. 

## Tech Stack

- **Frontend:** React, Vite, React Router, Ant Design
- **Backend:** Python, Flask, Flask-Caching, Flask-Limiter
- **Cloud & Serverless:** AWS (API Gateway & Lambda for contact form), Docker, Nginx, Gunicorn
- **Security:** In-memory rate limiting (Flask-Limiter), authenticated cache invalidation, input sanitization, HTTP security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options), URL scheme validation against stored XSS, and unprivileged non-root containers.
- **Performance:** Optimized WebP hero assets (>99% compression), Cloudinary dynamic resizing (`f_auto,q_auto`), lazy loading, Google Fonts non-blocking swap, Gzip compression, and HTTP caching headers.

---

## 🐳 Docker Setup

The project provides dedicated Docker Compose configurations for development and production environments.

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

### Local Development (`compose.dev.yml`)
Enables live file syncing and hot module reloading (HMR) without needing to rebuild containers on code changes.
- **Frontend (Vite dev server):** [http://localhost:5173](http://localhost:5173)
- **Backend API (Flask / Gunicorn with `--reload`):** [http://localhost:5001](http://localhost:5001)

```bash
# Start development environment
docker compose -f compose.dev.yml up --build

# Stop development environment
docker compose -f compose.dev.yml down
```

### Production (`compose.prod.yml`)
Builds optimized production assets, serves frontend statically via Nginx reverse proxy with gzip compression and Cloudflare caching headers, and runs production Gunicorn WSGI backend.
- **Frontend & Proxied API (Nginx):** [http://localhost:3000](http://localhost:3000)
- **Backend API (Direct loopback):** [http://127.0.0.1:5001](http://127.0.0.1:5001)

```bash
# Start production environment
docker compose -f compose.prod.yml up -d --build

# Stop production environment
docker compose -f compose.prod.yml down
```

---

## 🛠️ Manual Development Setup

If you prefer to run the application locally without Docker, follow the steps below.

### 1. Backend (Flask Server)

**Prerequisites:** Python 3.10+

Open a terminal and navigate to the `flask-server` directory:
```bash
cd flask-server
```

Create and activate a virtual environment:
```bash
# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Set up Environment Variables (create a `.env` file in the `flask-server` directory):
```env
FLASK_DEBUG=1
GITHUB_TOKEN=your_github_personal_access_token
```

Run the development server:
```bash
flask run --port=5001
```

Run the backend tests:
```bash
pip install -r requirements-dev.txt
pytest
```

**Backend layout:**
```
flask-server/
├── app.py                  # Entrypoint (gunicorn app:app) → create_app()
├── portfolio_api/
│   ├── __init__.py         # App factory: config, extensions, blueprints, 429 handler
│   ├── config.py           # All env-driven settings
│   ├── extensions.py       # cache, cors, limiter singletons
│   ├── routes/             # HTTP layer (Blueprints)
│   │   ├── health.py       # /api/ping
│   │   └── github.py       # /api/github/<user>/repos, /stats, /refresh
│   └── services/
│       └── github.py       # GitHub API calls (no Flask code)
└── tests/                  # pytest suite (excluded from Docker image)
```
New endpoints: add a Blueprint in `routes/`, put external-API logic in `services/`, register it in `portfolio_api/__init__.py`.

### 2. Frontend (React + Vite)

**Prerequisites:** Node.js 18+

Open a new terminal and navigate to the `client` directory:
```bash
cd client
```

Install the Node dependencies:
```bash
npm install
```

Configure Environment Variables:
The client uses `.env.local` for development. Ensure it has the correct API URLs:
```env
VITE_FLASK_API_URL=http://127.0.0.1:5001
VITE_CONTACT_API_URL=https://your-api-id.execute-api.your-region.amazonaws.com/default/PortfolioWebsiteContactForm
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will be available at [http://localhost:5173](http://localhost:5173) (or the port specified by Vite).

---

## 📦 Building for Production (Manual)

To build the frontend for production manually:

```bash
cd client
npm run build
```
This generates a `dist` folder which can be hosted on GitHub Pages, Vercel, Netlify, or served statically using Nginx.

---

## 📊 Tech Stack & Radar Graph Architecture

The portfolio dynamically visualizes hands-on experience via an interactive SVG Radar Graph (`RadarGraph.jsx`).

### `PortfolioWebsiteInfo.json` Schema
Repositories can define their technical capabilities using the categorized `techStack` object:

```json
{
  "title": "Portfolio Website",
  "description": "A full-stack personal portfolio website showcasing my projects, skills, and experience...",
  "techStack": {
    "Frontend": ["React", "Vite", "CSS", "Ant Design"],
    "Backend": ["Python", "Flask", "Gunicorn"],
    "AI": ["Gemini API", "Claude API"],
    "DevSecOps": ["Docker", "Nginx", "Cloudflare", "AWS", "Cloudinary", "GitHub Actions"],
    "Test Automation": ["Pytest"]
  },
  "liveDemo": "https://juhilkbhatt.github.io/Portfolio-Website/",
  "images": [ ... ],
  "Priority": 1,
  "category": "Full Stack",
  "type": "Solo",
  "version": "Prod",
  "versionNumber": "1.0.0",
  "Visibilty": true
}
```

### Components & Pipelines
- **`RadarGraph.jsx`:** Modular SVG-based radar chart rendering an Overview of all 5 disciplines as well as dedicated per-category drill-down radar charts. Features dynamic axis recalculation, interactive category filter tabs, concentric grid levels, vertex glow effects, and a companion breakdown panel with project badges and tool associations.
- **`useTechStack.js`:** React hook that aggregates categorized tools and projects across all ingested repositories, tracking which projects use each tool and discipline, with canonical naming and case-insensitive deduplication.
- **`ProjectCard.jsx`:** Backward-compatible renderer supporting both new `techStack` category objects and legacy `language` arrays.
- **`CompactCard.jsx`:** Callable, dynamically generated component showcasing projects and arbitrary technical data with terminal/cyberpunk styling, dynamic tag formatting (`PROJ-<repoId> // <CATEGORY>` using real GitHub repository IDs), status badge variants (`Prod`, `Beta`, `Alpha`) styled via `getBadgeClass`, adjacent version number pills (`vX.Y.Z` derived from `PortfolioWebsiteInfo.json`), tag pills, bottom baseline alignment, zero-CLS skeleton states (`CompactCard.Skeleton`), and responsive grid layout (`CompactCard.Grid`).
- **`DispatchContactForm.jsx`:** Callable, dynamic terminal/cyberpunk outreach form (`sys/dispatch_outreach.sh`) with macOS window controls, end-to-end encryption pill badge, recruiter intake fields (name, company, email, opportunity type, compensation band, message/JD URL), deterministic delivery callout banner, and direct routing through AWS API Gateway / Lambda serverless pipeline (`VITE_CONTACT_API_URL`).

