# SoulSync Backend API 🌿

Node.js + Express + MongoDB REST API for the SoulSync emotional wellness platform.

---

## Tech Stack

| Layer       | Technology                         |
|-------------|-----------------------------------|
| Runtime     | Node.js 18+                       |
| Framework   | Express.js 4.x                    |
| Database    | MongoDB + Mongoose ODM             |
| Auth        | JWT (jsonwebtoken) + bcryptjs      |
| AI Chatbot  | OpenAI GPT-3.5-turbo (optional)   |
| Security    | Helmet, CORS, express-rate-limit   |
| Logging     | Morgan                             |

---

## Quick Start

### 1. Install dependencies
```bash
cd soulsync-backend
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Seed the database (optional)
```bash
npm run seed
```

### 5. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## Environment Variables

| Variable         | Description                          | Required |
|------------------|--------------------------------------|----------|
| `PORT`           | Server port (default: 5000)          | No       |
| `MONGO_URI`      | MongoDB connection string            | Yes      |
| `JWT_SECRET`     | Secret key for JWT signing           | Yes      |
| `JWT_EXPIRES_IN` | JWT expiry duration (default: 30d)   | No       |
| `OPENAI_API_KEY` | OpenAI API key for AI chatbot        | No       |
| `CLIENT_URL`     | Frontend URL for CORS                | No       |

---

## API Endpoints

### Auth
| Method | Endpoint                    | Auth     | Description          |
|--------|-----------------------------|----------|----------------------|
| POST   | `/api/auth/register`        | None     | Register new user    |
| POST   | `/api/auth/login`           | None     | Login user           |
| GET    | `/api/auth/me`              | Required | Get current user     |
| PUT    | `/api/auth/update-password` | Required | Update password      |

### Users
| Method | Endpoint                        | Auth     | Description          |
|--------|---------------------------------|----------|----------------------|
| GET    | `/api/users/profile`            | Required | Get full profile     |
| PUT    | `/api/users/profile`            | Required | Update profile       |
| POST   | `/api/users/save-activity/:id`  | Required | Save/unsave activity |
| DELETE | `/api/users/account`            | Required | Deactivate account   |

### Activities
| Method | Endpoint              | Auth     | Description           |
|--------|-----------------------|----------|-----------------------|
| GET    | `/api/activities`     | Optional | List all activities   |
| GET    | `/api/activities/:id` | Optional | Get activity detail   |
| POST   | `/api/activities`     | Required | Create activity       |

**Query params:** `category`, `search`, `difficulty`, `page`, `limit`

### Therapies
| Method | Endpoint             | Auth     | Description          |
|--------|----------------------|----------|----------------------|
| GET    | `/api/therapies`     | Optional | List all therapies   |
| GET    | `/api/therapies/:id` | Optional | Get therapy + events |
| POST   | `/api/therapies`     | Required | Create therapy       |

### Communities
| Method | Endpoint                      | Auth     | Description          |
|--------|-------------------------------|----------|----------------------|
| GET    | `/api/communities`            | Optional | List communities     |
| GET    | `/api/communities/:id`        | Optional | Get community detail |
| POST   | `/api/communities`            | Required | Create community     |
| POST   | `/api/communities/:id/join`   | Required | Join/leave community |

### Posts
| Method | Endpoint                   | Auth     | Description          |
|--------|----------------------------|----------|----------------------|
| GET    | `/api/posts?community=:id` | Optional | Get community posts  |
| POST   | `/api/posts`               | Required | Create a post        |
| POST   | `/api/posts/:id/upvote`    | Required | Upvote/un-upvote     |
| POST   | `/api/posts/:id/comment`   | Required | Add a comment        |
| DELETE | `/api/posts/:id`           | Required | Delete own post      |

### Events
| Method | Endpoint                     | Auth     | Description          |
|--------|------------------------------|----------|----------------------|
| GET    | `/api/events`                | Optional | List events          |
| GET    | `/api/events/:id`            | Optional | Get event detail     |
| POST   | `/api/events/:id/register`   | Required | Register/unregister  |
| POST   | `/api/events`                | Required | Create event         |

**Query params:** `therapy`, `upcoming`, `page`, `limit`

### Assessments
| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| GET    | `/api/assessments`        | Required | Get user's assessments   |
| GET    | `/api/assessments/latest` | Required | Get latest assessment    |
| POST   | `/api/assessments`        | Required | Submit new assessment    |
| DELETE | `/api/assessments/:id`    | Required | Delete an assessment     |

### Chat
| Method | Endpoint   | Auth     | Description                    |
|--------|------------|----------|--------------------------------|
| POST   | `/api/chat`| Optional | Send message to AI companion   |

---

## Database Schema

```
Users           → name, email, password, avatar, bio, savedActivities[], joinedCommunities[], registeredEvents[]
Activities      → name, emoji, category, shortDesc, description, benefits[], steps[], duration, difficulty, color
Therapies       → name, short, emoji, tagline, explanation, helps[], howItWorks, color
Communities     → name, emoji, description, members[], memberCount, color
Posts           → title, content, author, community, upvotes[], comments[]
Events          → title, description, therapy, date, location, totalSpots, registrations[]
StressAssessments → user, answers[], totalScore, stressLevel, recommendations{}
```

---

## Response Format

All responses follow this consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Running Tests

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```
