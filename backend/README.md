# Prep Partner Backend

This is the backend for Prep Partner, built with FastAPI and PostgreSQL.

## Features

- **Authentication**: JWT based login and registration.
- **Users & Roles**: Role-based access control.
- **Companies**: Management of target companies and their criteria.
- **Question Bank**: Support for MCQ, DSA, and Interview questions.
- **Attempts**: Track user performance and history.

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL
- Virtualenv (recommended)

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL credentials
     Example: `postgresql://user:password@localhost:5432/preppartner`

### Running the Server

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive API docs are available at `http://localhost:8000/docs`.

## Project Structure

- `app/api`: API route definitions.
- `app/core`: Core configuration and security logic.
- `app/db`: Database models and session management.
- `app/schemas`: Pydantic models for request/response validation.

## API Endpoints

- `POST /api/v1/auth/login/access-token`: Login
- `POST /api/v1/users/`: Register
- `GET /api/v1/users/me`: Get current user
- `GET /api/v1/questions/`: List questions
- `POST /api/v1/attempts/`: Submit an answer
