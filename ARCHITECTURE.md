# Rugby League Management System - Architecture

## System Overview
A comprehensive league management system for rugby leagues with real-time scoring, role-based access control, and multi-platform support (web, mobile, wearOS).

## Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Real-time**: Socket.io
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI

### Deployment
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL container
- **Cache/Sessions**: Redis container

### Future Mobile Apps
- React Native (iOS/Android)
- WearOS support for referee match tracking

## Core Entities

### User & Authentication
- **User**: Base user entity with credentials
- **Role**: Enum-based roles (SPECTATOR, PLAYER, MATCH_SECRETARY, COACH, PRESIDENT, REFEREE, HEAD_OFFICIAL, LEAGUE_ADMIN)
- **League-User Association**: Users have roles scoped to specific leagues

### League Structure
- **League**: Top-level organization
- **Division**: Multiple divisions per league
- **Team**: Teams assigned to divisions
- **Season**: Time-based league seasons

### Team Management
- **Team**: Core team entity
- **TeamContact**: President, coaches, match secretaries with contact details
- **Player**: Player roster with emergency contacts

### Match & Scoring
- **Match**: Match entity linking two teams
- **MatchEvent**: Time-stamped scoring events
  - Try (5 points)
  - Conversion (2 points)
  - Penalty Kick (3 points)
  - Drop Goal (3 points)
- **PenaltyCard**: Yellow/Red cards
- **PlayerSuspension**: Automatic suspensions based on cards

### League Configuration
- **BonusPointRule**: Configurable bonus points
  - 4+ tries in a match
  - Losing by < 7 points
  - Custom rules per league

### Statistics & Standings
- **LeagueStanding**: Calculated standings with:
  - Points
  - Wins/Losses/Draws
  - Points For/Against/Difference
  - Tries scored
  - Bonus points
  - Penalties received

## Role-Based Access Control (RBAC)

### Access Levels

1. **SPECTATOR** (Public)
   - View all matches, scores, standings across all leagues
   - Real-time score updates

2. **PLAYER**
   - View own team information
   - View own statistics
   - Access assigned league data

3. **MATCH_SECRETARY**
   - Manage team roster
   - Submit match sheets
   - View team communications

4. **COACH**
   - All MATCH_SECRETARY permissions
   - View player statistics
   - Manage training schedules

5. **PRESIDENT** (Club Level)
   - All COACH permissions
   - Manage team contacts
   - Financial oversight

6. **REFEREE** (Match Officials)
   - Record match events during games
   - Issue penalty cards
   - Submit match reports

7. **HEAD_OFFICIAL**
   - All REFEREE permissions
   - Review and approve match reports
   - Manage referee assignments

8. **LEAGUE_ADMIN**
   - Create/manage leagues and divisions
   - Manage teams and registrations
   - Configure bonus point rules
   - Manage suspensions
   - Full system access within their league

## Real-Time Features

### WebSocket Events
- `match:score_update` - Live scoring updates
- `match:event` - Try, conversion, penalty, card events
- `match:status` - Match start/end/pause
- `standings:update` - Standing recalculations

### Subscriptions
- Users subscribe to specific matches or leagues
- Automatic updates pushed to connected clients

## API Structure

### Public Endpoints
- `GET /leagues` - List all leagues
- `GET /leagues/:id/standings` - League standings
- `GET /matches` - List matches
- `GET /matches/:id` - Match details with live score

### Authenticated Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/profile` - User profile

### League Management (LEAGUE_ADMIN)
- `POST /leagues` - Create league
- `POST /leagues/:id/divisions` - Add division
- `POST /leagues/:id/teams` - Add team
- `PUT /leagues/:id/bonus-rules` - Configure bonus points

### Team Management (PRESIDENT+)
- `POST /teams/:id/contacts` - Add team contacts
- `PUT /teams/:id/contacts/:contactId` - Update contacts
- `GET /teams/:id/players` - List players
- `POST /teams/:id/players` - Add player

### Match Management (REFEREE+)
- `POST /matches/:id/events` - Record scoring event
- `POST /matches/:id/cards` - Issue penalty card
- `PUT /matches/:id/status` - Update match status

### Statistics
- `GET /leagues/:id/standings` - League standings
- `GET /teams/:id/statistics` - Team statistics
- `GET /players/:id/statistics` - Player statistics

## Database Schema Highlights

### Multi-tenancy
- League-based data isolation
- User-League-Role associations
- Division-based team groupings

### Audit Trail
- All match events time-stamped
- Card issuance tracked with officials
- Suspension history maintained

### Flexible Configuration
- JSON fields for custom bonus rules
- Extensible contact information
- Configurable match event types

## Security Considerations

1. **Authentication**: JWT tokens with refresh token rotation
2. **Authorization**: Role-based guards on all endpoints
3. **Data Isolation**: Users only access authorized league data
4. **Rate Limiting**: API rate limiting per user
5. **Input Validation**: Strict validation on all inputs
6. **SQL Injection**: TypeORM parameterized queries

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│          Nginx (Reverse Proxy)          │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌──────────┐  ┌─────────┐
│  Web   │  │  API     │  │ Socket  │
│ Client │  │ (NestJS) │  │   .io   │
└────────┘  └─────┬────┘  └────┬────┘
                  │             │
         ┌────────┼─────────────┘
         │        │
         ▼        ▼
    ┌────────┐ ┌──────┐
    │PostGres│ │Redis │
    └────────┘ └──────┘
```

## Mobile App Considerations

### Referee Watch App
- Simplified UI for match event recording
- Large buttons for Try, Conversion, Penalty, Card
- Voice input support
- Offline capability with sync
- Quick access to player lists

### Mobile Features
- Push notifications for match updates
- Offline viewing of standings
- Match day lineups
- Player statistics

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API servers
2. **Database**: Connection pooling, read replicas
3. **Caching**: Redis for frequently accessed data (standings, schedules)
4. **WebSocket**: Redis adapter for multi-server socket synchronization
5. **CDN**: Static assets served via CDN

## Development Phases

### Phase 1: Core Backend (Current)
- Database schema and migrations
- Authentication and RBAC
- Core entities and relationships
- Basic CRUD operations

### Phase 2: Match Management
- Real-time scoring
- Match event tracking
- Penalty and suspension system
- Standings calculation

### Phase 3: Advanced Features
- Configurable bonus points
- Detailed statistics
- Player performance tracking
- Match reports

### Phase 4: Mobile Apps
- React Native app
- WearOS referee app
- Push notifications

### Phase 5: Production Ready
- Performance optimization
- Comprehensive testing
- Monitoring and logging
- Production deployment guides
