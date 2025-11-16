## Movie Booking System — Phase 2

### Overview
- **Django REST Framework** (Backend API)
- **React + Vite** (Frontend)
- **PostgreSQL** (Cloud Database, hosted on Render.com)
- **JWT Authentication** (Access & Refresh Tokens)

#### Getting Started
```bash
git clone https://github.com/DEX-01-CODER/movie-booking-system.git
cd movie-booking-system
```

### Backend Setup
```bash
python -m venv env
```
#### Activate: <br>
#### Windows: <br>
``` 
.\venv\Scripts\Activate.ps1
```
#### Mac/Linux: <br>
```
source env/bin.activate
```

#### Install Dependencies
```
cd backend
pip install -r requirements.txt
```

##### Environment Variables
1. Duplicate example env file:
   ```
   cp .env.example .env
   ```
2. Fill in the database credentials:
   ```
   DB_HOST=
   DB_PORT=
   DB_USER=
   DB_NAME=
   DB_PWD=
   ```
### Frontend
```
cd frontend
npm install
```

### Running the App
```
cd backend
python manage.py runserver
```
```
cd frontend
npm run dev
```


Docs live in `docs/phase2`. Update `API.md`, diagrams, and `DemoScript.md` as you build.
