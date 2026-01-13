# Incident Tracking Dashboard

A security operations incident tracking system that receives data via webhook from an AI Voice Agent, saves it to a database, and visualizes incidents on an interactive map.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Map:** React-Leaflet (OpenStreetMap)
- **Deployment Target:** Railway

## Features

- 📍 Interactive map with location markers
- 🔔 Webhook endpoint for receiving incident data
- 📊 Incident history per location
- 📄 PDF report generation
- 🎨 Modern UI with Tailwind CSS and Shadcn/UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Railway)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and set your database connection:

**For local development:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/incident_tracking?schema=public"
```

Replace `user`, `password`, and `incident_tracking` with your actual PostgreSQL credentials.

**For Railway deployment:**
- Railway automatically provides a `DATABASE_URL` when you add a PostgreSQL service
- You can find it in your Railway project settings under "Variables"
- It will look like: `postgresql://postgres:password@hostname:5432/railway`

3. **Set up the database:**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npm run db:push

# Seed the database with initial locations
npm run db:seed
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## API Endpoints

### Webhook: POST `/api/webhook/incident`

Receives incident data from the AI Voice Agent.

**Request Body:**
```json
{
  "location_name": "Zara Gran Via",
  "severity": "High",
  "category": "Theft",
  "summary": "Short summary text...",
  "html_report": "Raw HTML string..."
}
```

**Response:**
```json
{
  "success": true,
  "incident": {
    "id": "...",
    "createdAt": "...",
    "summary": "...",
    "severity": "...",
    "location": {
      "name": "...",
      "address": "..."
    }
  }
}
```

### Locations: GET `/api/locations`

Returns all locations with their incidents.

## Database Schema

### Location
- `id`: String (CUID)
- `name`: String
- `lat`: Float
- `lng`: Float
- `address`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Incident
- `id`: String (CUID)
- `createdAt`: DateTime
- `summary`: String
- `severity`: String (Low/Medium/High)
- `htmlReport`: Text
- `locationId`: String (Foreign Key)

## Deployment to Railway

1. Push your code to a Git repository
2. Create a new project on Railway
3. Add a PostgreSQL service
4. Add your repository as a service
5. Set the `DATABASE_URL` environment variable
6. Railway will automatically build and deploy

The app will run the `postinstall` script to generate Prisma Client and you can run migrations/seeds via Railway's CLI or dashboard.

## Usage

1. The map displays all locations with markers
2. Click on any marker to view incident details
3. The sidebar shows:
   - Store name and address
   - Latest incident summary ("Resumencillo")
   - Full incident history (most recent first)
   - Download PDF button for each incident

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
