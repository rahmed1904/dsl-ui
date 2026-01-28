# DSL Studio - Setup & Startup Guide

## Quick Start (Recommended)

The easiest way to get the app running is to use the startup script:

```bash
./startup.sh
```

This single command will:
- ✅ Check all prerequisites (Docker, Node.js, Python)
- ✅ Start MongoDB in Docker
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Start the backend API server
- ✅ Start the frontend dev server
- ✅ Load sample data automatically

The app will be available at: **http://localhost:3000**

---

## Manual Setup (If You Prefer)

### Prerequisites

1. **Docker** - Required for MongoDB
   ```bash
   # Check if installed
   docker --version
   ```

2. **Node.js** - Required for frontend
   ```bash
   # Check if installed
   node --version
   ```

3. **Python 3** - Required for backend
   ```bash
   # Check if installed
   python3 --version
   ```

### Step 1: Start MongoDB

```bash
# Start MongoDB in Docker (first time)
docker run -d --name mongodb -p 27017:27017 mongo:latest

# If container already exists but stopped
docker start mongodb

# Verify MongoDB is running
docker ps | grep mongodb
```

### Step 2: Install Backend Dependencies

```bash
cd backend

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend

npm install --legacy-peer-deps
```

### Step 4: Start Backend Server

```bash
cd backend

# Make sure venv is activated if you created one
source venv/bin/activate

# Start the server
python server.py
```

The backend will start on: **http://localhost:8000**

### Step 5: Start Frontend Dev Server

In a **new terminal**:

```bash
cd frontend

npm start
```

The frontend will start on: **http://localhost:3000**

### Step 6: Load Sample Data

In another **new terminal**:

```bash
curl -X POST http://localhost:3000/api/load-sample-data
```

---

## Stopping the Application

### Using the stop script:
```bash
./stop.sh
```

### Manual stop:
```bash
# Stop frontend (Ctrl+C in its terminal)
# Stop backend (Ctrl+C in its terminal)
# Stop MongoDB
docker stop mongodb
```

---

## Accessing the App

Once running, you can access:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **MongoDB:** localhost:27017

### Sample Credentials
- **Email:** admin@fyntrac.com
- **Password:** Funrun21@19b

---

## Features Available

✅ **133 DSL Functions** - Financial calculations, date functions, arrays, etc.
✅ **Event Management** - Define and manage event structures
✅ **DSL Code Editor** - Write and execute DSL code
✅ **Templates** - Save and reuse DSL code templates
✅ **AI Chat Assistant** - Get help writing DSL code
✅ **Sample Data** - Pre-loaded financial data for testing

---

## Troubleshooting

### Frontend not loading
```bash
# Check frontend logs
tail -f /tmp/frontend.log

# Kill and restart
./stop.sh
./startup.sh
```

### Backend connection error
```bash
# Check backend logs
tail -f /tmp/backend.log

# Verify MongoDB is running
docker ps | grep mongodb

# Restart MongoDB if needed
docker start mongodb
```

### MongoDB not found
```bash
# Start MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Kill process on port 8000
lsof -ti :8000 | xargs kill -9

# Kill process on port 27017
docker stop mongodb
```

---

## Development

### Project Structure
```
dsl/
├── frontend/          # React app
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/          # FastAPI app
│   ├── server.py
│   ├── dsl_functions.py
│   └── requirements.txt
├── startup.sh        # Start all services
└── stop.sh          # Stop all services
```

### Key Files
- **[backend/server.py](backend/server.py)** - FastAPI backend
- **[backend/dsl_functions.py](backend/dsl_functions.py)** - 133 DSL functions
- **[frontend/src/pages/Dashboard.js](frontend/src/pages/Dashboard.js)** - Main UI
- **[frontend/src/setupProxy.js](frontend/src/setupProxy.js)** - API proxy configuration

---

## API Documentation

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dsl-functions` | GET | Get all 133 DSL functions |
| `/api/events` | GET | Get all event definitions |
| `/api/templates` | GET | Get all DSL templates |
| `/api/transaction-reports` | GET | Get transaction reports |
| `/api/load-sample-data` | POST | Load demo data |
| `/api/chat` | POST | AI chat assistant |

---

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Radix UI, Monaco Editor, Axios
- **Backend:** FastAPI, Uvicorn, Motor (async MongoDB)
- **Database:** MongoDB
- **Build:** Webpack (via Create React App), Craco

---

## Notes

- MongoDB runs in Docker - no installation needed on your machine
- The app uses a webpack proxy to forward API calls from port 3000 to 8000
- Sample data is pre-loaded and can be reset with the `/api/load-sample-data` endpoint
- The backend runs without MongoDB fallback - MongoDB must be running

