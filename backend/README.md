# K-CUBE Backend

Enterprise-ready Node.js + Express backend for the K-CUBE Korean digital ecosystem.

## Features
- JWT authentication with refresh tokens
- MySQL connection pooling
- Role-based and category-based access middleware
- Rate limiting and security headers
- User, map, and analytics REST API structure
- Database schema for users, sessions, chapters, rewards, lessons, and audit events

## Run locally
1. Copy `.env.example` to `.env`
2. Set the MySQL credentials and JWT secrets
3. Run `npm install`
4. Run `npm run dev`
