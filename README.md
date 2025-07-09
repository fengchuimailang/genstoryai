# GenStoryAI

A full-stack AI story generation application with FastAPI backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### Deployment

#### Option 1: Using Docker Compose (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd genstoryai

# Set environment variables (optional)
export OPENAI_API_KEY=your-openai-key
export SECRET_KEY=your-secret-key

# Deploy using Docker Compose
docker-compose up -d
```

#### Option 2: Using Deployment Script
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

#### Option 3: Manual Docker Build
```bash
# Build the image
docker build -t genstoryai-app:latest .

# Run the container
docker run -d \
    --name genstoryai-app \
    -p 80:80 \
    --restart unless-stopped \
    genstoryai-app:latest
```

### Access the Application
- **Frontend**: http://localhost
- **API Documentation**: http://localhost/docs
- **Health Check**: http://localhost/api/health

## 🏗️ Architecture

### New Architecture (FastAPI Static Files)
- **Single Container**: FastAPI serves both API and static files
- **Frontend**: React SPA with client-side routing
- **Backend**: FastAPI with SQLite database
- **Build Process**: Multi-stage Docker build

### Key Features
- ✅ Single container deployment
- ✅ No Nginx required
- ✅ SPA routing support
- ✅ Static file caching
- ✅ Health checks
- ✅ Docker image rollback support

## 🔧 Configuration

### Environment Variables
```bash
PORT=80                          # Application port
OPENAI_API_KEY=your-openai-key     # OpenAI API key
OPENAI_BASE_URL=http://localhost:11434/v1  # OpenAI base URL
OPENAI_MODEL=qwen3:4b              # OpenAI model
DATABASE_URL=sqlite:///./genstoryai.db  # Database URL
SECRET_KEY=your-secret-key         # JWT secret key
ALGORITHM=HS256                    # JWT algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=120    # Token expiration
# ... other email and logging configs
```

## 📁 Project Structure
```
genstoryai/
├── backend/genstoryai_backend/    # FastAPI backend
├── frontend/genstoryai_frontend/  # React frontend
├── scripts/                       # Deployment scripts
├── Dockerfile                     # Multi-stage Docker build
├── docker-compose.yml            # Docker Compose config
└── README.md                     # This file
```

## 🚀 CI/CD

The project uses GitHub Actions for automated deployment:
- **Trigger**: Push to `main` or `dev` branches
- **Process**: 
  1. Sync code to server
  2. Build Docker image
  3. Deploy container
  4. Health checks
  5. Rollback on failure

## 🔍 Monitoring

### Health Checks
- **Backend**: `GET /api/health`
- **Frontend**: `GET /`

### Logs
```bash
# View container logs
docker logs genstoryai-app

# Follow logs
docker logs -f genstoryai-app
```

## 🛠️ Development

### Local Development
```bash
# Backend development
cd backend/genstoryai_backend
poetry install
poetry run start

# Frontend development
cd frontend/genstoryai_frontend
pnpm install
pnpm dev
```

### Building Frontend
```bash
cd frontend/genstoryai_frontend
pnpm build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

