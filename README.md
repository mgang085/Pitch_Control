# Pitch Control - Rugby League Management System

A comprehensive league management system for rugby leagues with real-time scoring, role-based access control, and multi-platform support.

## Features

### Core Functionality
- **League Management**: Create and manage multiple leagues with divisions
- **Team Management**: Full team rosters with contacts (presidents, coaches, match secretaries)
- **Player Management**: Track players with emergency contacts and statistics
- **Match Management**: Schedule matches and record live scoring events
- **Real-time Scoring**: Track tries, conversions, penalty kicks, and drop goals
- **Penalty System**: Issue yellow/red cards with automatic suspensions
- **Standings**: Automatic calculation of league standings with detailed statistics
- **Bonus Points**: Configurable bonus point rules (e.g., 4 tries, losing by <7 points)

### Role-Based Access Control
- **Spectator**: View all public data across leagues
- **Player**: View own team and statistics
- **Match Secretary**: Manage team roster and submissions
- **Coach**: Team management and player statistics
- **President**: Full club-level management
- **Referee**: Record match events and issue cards
- **Head Official**: Referee management and match report approval
- **League Admin**: Full system administration within their league

### Technical Features
- RESTful API with comprehensive Swagger documentation
- JWT-based authentication
- PostgreSQL database with TypeORM
- Docker containerization for easy deployment
- Prepared for WebSocket real-time updates
- Designed for mobile and wearOS support

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design and technical architecture.

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL 15+ (if running without Docker)

## Quick Start with Docker (Full Stack)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pitch_Control
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set secure values for:
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `DB_PASSWORD`

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Web Interface**: http://localhost (or http://localhost:80)
   - **API**: http://localhost:3000/api/v1
   - **Swagger Documentation**: http://localhost:3000/api/v1/docs

5. **Login with default admin credentials**
   ```
   Username: admin
   Password: Alamo123
   ```

   The admin user is automatically created on first startup!

## Local Development Setup

### Backend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local database credentials.

3. **Start PostgreSQL and Redis**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Seed the database** (creates default admin user)
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run start:dev
   ```

The API will be available at http://localhost:3000/api/v1

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The web interface will be available at http://localhost:3001

### Default Admin Login
```
Username: admin
Password: Alamo123
```

## API Documentation

Once the application is running, access the interactive Swagger documentation at:
```
http://localhost:3000/api/v1/docs
```

### Key API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with username/password
- `GET /api/v1/auth/profile` - Get current user profile

#### Leagues
- `GET /api/v1/leagues` - List all leagues (public)
- `POST /api/v1/leagues` - Create league (admin)
- `GET /api/v1/leagues/:id` - Get league details (public)

#### Divisions
- `GET /api/v1/divisions?leagueId=xxx` - List divisions (public)
- `POST /api/v1/divisions` - Create division (admin)

#### Teams
- `GET /api/v1/teams?divisionId=xxx` - List teams (public)
- `POST /api/v1/teams` - Create team (admin)
- `GET /api/v1/teams/:id` - Get team with roster (public)

#### Players
- `GET /api/v1/players?teamId=xxx` - List players (public)
- `POST /api/v1/players` - Add player (match secretary+)
- `GET /api/v1/players/:id` - Get player details (public)

#### Matches
- `GET /api/v1/matches?divisionId=xxx` - List matches (public)
- `POST /api/v1/matches` - Create match (admin)
- `GET /api/v1/matches/:id` - Get match with events (public)
- `POST /api/v1/matches/:id/start` - Start match (referee)
- `POST /api/v1/matches/:id/end` - End match (referee)
- `POST /api/v1/matches/:id/events` - Record scoring event (referee)

#### Standings
- `GET /api/v1/standings/division/:divisionId` - Get standings (public)
- `POST /api/v1/standings/division/:divisionId/calculate` - Recalculate standings

## Usage Examples

### 1. Register and Login

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### 2. Create a League (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/leagues \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "National Rugby League",
    "description": "Premier rugby league competition",
    "seasonStart": "2024-01-01",
    "seasonEnd": "2024-12-31"
  }'
```

### 3. Create a Division

```bash
curl -X POST http://localhost:3000/api/v1/divisions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leagueId": "league-uuid",
    "name": "Premier Division",
    "level": 1
  }'
```

### 4. Record a Try During a Match

```bash
curl -X POST http://localhost:3000/api/v1/matches/match-uuid/events \
  -H "Authorization: Bearer REFEREE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "team-uuid",
    "playerId": "player-uuid",
    "eventType": "TRY",
    "minute": 23
  }'
```

## Database Schema

Key entities and their relationships:

```
League
  ├── Divisions
  │     └── Teams
  │           ├── Players
  │           ├── Team Contacts
  │           └── Matches (as home/away)
  └── Bonus Point Rules

Match
  ├── Match Events (scoring)
  └── Penalty Cards

User
  └── User-League Roles
```

## Scoring System

### Points
- **Try**: 5 points
- **Conversion**: 2 points
- **Penalty Kick**: 3 points
- **Drop Goal**: 3 points

### Match Points (Standings)
- **Win**: 4 points
- **Draw**: 2 points
- **Loss**: 0 points
- **Bonus Points**: Configurable per league

### Penalty Cards
- **Yellow Card**: Temporary suspension (10 minutes)
- **Red Card**: Ejection + 1 match suspension (configurable)

## Development

### Project Structure

```
src/
├── common/             # Shared utilities, guards, decorators
│   ├── decorators/     # Custom decorators (Roles, CurrentUser, Public)
│   ├── enums/          # Shared enums
│   └── guards/         # Authentication and authorization guards
├── config/             # Configuration files
├── modules/            # Feature modules
│   ├── auth/           # Authentication (JWT)
│   ├── users/          # User management
│   ├── leagues/        # League management
│   ├── divisions/      # Division management
│   ├── teams/          # Team management
│   ├── players/        # Player management
│   ├── matches/        # Match and scoring management
│   └── standings/      # Standings calculation
├── app.module.ts       # Root application module
└── main.ts             # Application entry point
```

### Available Scripts

```bash
# Development
npm run start:dev       # Start with hot reload
npm run start:debug     # Start with debug mode

# Building
npm run build           # Build for production
npm run start:prod      # Run production build

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Generate coverage report

# Code Quality
npm run lint            # Lint code
npm run format          # Format code with Prettier

# Database
npm run typeorm         # Run TypeORM CLI
npm run migration:generate  # Generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert last migration
```

## Deployment

### Docker Deployment (Recommended)

1. **Production Environment File**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Build and Deploy**
   ```bash
   docker-compose up -d
   ```

3. **Check Logs**
   ```bash
   docker-compose logs -f api
   ```

4. **Scale API (if needed)**
   ```bash
   docker-compose up -d --scale api=3
   ```

### Manual Deployment

1. Build the application
   ```bash
   npm run build
   ```

2. Set environment variables

3. Run migrations
   ```bash
   npm run migration:run
   ```

4. Start the application
   ```bash
   npm run start:prod
   ```

## Future Enhancements

### Phase 1 (Current)
- ✅ Core API with authentication
- ✅ League, division, team, player management
- ✅ Match scheduling and scoring
- ✅ Standings calculation
- ✅ Docker deployment

### Phase 2 (Planned)
- WebSocket real-time scoring updates
- Enhanced bonus point rules engine
- Player statistics and performance tracking
- Match reports and referee notes
- Suspension management system

### Phase 3 (Planned)
- React Native mobile app
- WearOS app for referee match tracking
- Push notifications
- Offline mode with sync

### Phase 4 (Planned)
- Advanced analytics and insights
- Photo uploads (team logos, player photos)
- Social features (match comments, reactions)
- Export capabilities (PDF reports, CSV data)

## Security

### Important Security Considerations

1. **Change Default Secrets**: Always change JWT secrets in production
2. **Use HTTPS**: Never expose API over HTTP in production
3. **Rate Limiting**: Implement rate limiting for production (not included in base)
4. **Input Validation**: All inputs are validated using class-validator
5. **SQL Injection**: Protected by TypeORM parameterized queries
6. **XSS**: Protected by proper input sanitization

### Role-Based Access

The system implements strict role-based access control. Users can only perform actions their role permits. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed permissions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- [Swagger](https://swagger.io/) - API documentation
