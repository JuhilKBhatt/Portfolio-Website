# Portfolio Website

A full-stack portfolio website built with a React + Vite frontend and a Python Flask backend API. 

## Tech Stack

- **Frontend:** React, Vite, React Router, Ant Design
- **Backend:** Python, Flask, Flask-Caching, Flask-Limiter
- **Cloud & Serverless:** AWS (API Gateway & Lambda for contact form), Docker, Nginx, Gunicorn
- **Security:** In-memory rate limiting (Flask-Limiter), authenticated cache invalidation, input sanitization, HTTP security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options), URL scheme validation against stored XSS, and unprivileged non-root containers.
- **Performance:** Optimized WebP hero assets (>99% compression), Cloudinary dynamic resizing (`f_auto,q_auto`), lazy loading, Google Fonts non-blocking swap, Gzip compression, and HTTP caching headers.

---

## 🐳 Quickstart (Docker)

The easiest way to run the entire application (frontend and backend) is using Docker.

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

1. Clone the repository and navigate to the project root.
2. Build and start the containers:
   ```bash
   docker compose up --build
   ```
3. Access the application:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:5001](http://localhost:5001)

To stop the containers, use `Ctrl+C` or run:
```bash
docker compose down
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
