# Fitness Analytics Platform

AI-powered Instagram analytics and prediction platform for gym owners. Predict post engagement, lead conversions, optimal posting times, and get AI-generated promotional offer recommendations.

## Features

- 📊 **Engagement Prediction** - Predict likes, comments, and shares before posting
- 🎯 **Lead Conversion** - Estimate membership sign-ups from posts
- ⏰ **Optimal Timing** - Find the best times to reach your audience
- 🎁 **Offer Recommendations** - AI-suggested promotional offers with generated copy
- 📈 **Analytics Dashboard** - Track performance over time
- 📱 **Mobile Responsive** - Access insights anywhere

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL with asyncpg
- **ORM**: SQLAlchemy with async support
- **Authentication**: JWT tokens
- **ML/AI**: PyTorch, TensorFlow, Scikit-learn, Transformers, OpenAI/Anthropic APIs
- **Caching**: Redis
- **MLOps**: MLflow

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Alembic
- **API Documentation**: OpenAPI/Swagger (built-in with FastAPI)

## Project Structure

```
fitness-analytics/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Configuration, database, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── ml/            # ML models
│   ├── tests/             # Backend tests
│   ├── alembic/           # Database migrations
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   └── styles/        # Global styles
│   ├── package.json       # Node dependencies
│   └── Dockerfile
├── docker-compose.yml      # Local development
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   API documentation will be available at http://localhost:8000/api/docs

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Application will be available at http://localhost:3000

### Using Docker Compose (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Check logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get access token

### Instagram
- `POST /api/v1/instagram/connect` - Connect Instagram account
- `GET /api/v1/instagram/accounts` - List connected accounts
- `POST /api/v1/instagram/sync/{account_id}` - Sync posts from Instagram

### Predictions
- `POST /api/v1/predict/engagement` - Predict engagement metrics
- `POST /api/v1/predict/conversion` - Predict lead conversions
- `POST /api/v1/predict/timing` - Get optimal posting times
- `POST /api/v1/predict/offer` - Get offer recommendations
- `GET /api/v1/predict/history` - Get prediction history

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `INSTAGRAM_CLIENT_ID` - Instagram API client ID (see INSTAGRAM_SETUP.md)
- `INSTAGRAM_CLIENT_SECRET` - Instagram API client secret (see INSTAGRAM_SETUP.md)
- `INSTAGRAM_REDIRECT_URI` - OAuth callback URL
- `OPENAI_API_KEY` - OpenAI API key (for LLM features)
- `ANTHROPIC_API_KEY` - Anthropic API key (for LLM features)

### Instagram Integration Setup

**Note: This setup is for YOU (the developer). End users do NOT need to do this.**

To enable Instagram SSO and data syncing:

1. **Follow the setup guide**: See [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) for detailed instructions
2. **Create Meta Developer app**: Go to [developers.facebook.com](https://developers.facebook.com/)
3. **Add Instagram Basic Display**: Configure OAuth redirect URIs
4. **Get credentials**: Copy App ID and App Secret
5. **Configure environment**: Add to `backend/.env`

**For End Users:**
- They simply click "Connect Instagram" in your app
- They log in to THEIR Instagram account
- They authorize your app to access their data
- Done! No technical setup required on their end

**Important**: For production deployment, the app must be submitted for Meta review (takes 1-2 weeks). This is a one-time review for your app - once approved, all end users can connect their Instagram accounts.

## Development

### Running Tests

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

### Code Quality

**Backend:**
```bash
cd backend
black app/
isort app/
pylint app/
mypy app/
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Roadmap

- [x] Project setup and infrastructure
- [x] Backend API structure
- [x] Database models and migrations
- [x] Instagram Graph API integration
- [x] ML model development
- [x] Frontend dashboard
- [ ] Testing and optimization
- [ ] Cloud deployment
- [ ] Monitoring and logging

## Current Status

✅ **Completed Core Features:**
- Full backend API with FastAPI
- Authentication system with JWT
- Instagram Graph API integration
- ML models for predictions (engagement, conversion, timing, offers)
- Responsive frontend dashboard with Next.js
- Database migrations with Alembic
- Docker Compose for local development

🚧 **In Progress:**
- Testing and optimization
- Cloud deployment setup
- Monitoring and logging infrastructure

## Contributing

This is a private project. For questions or issues, please contact the development team.

## License

Proprietary - All rights reserved
