# Playlist API

A RESTful API for managing music playlists built with Express.js and documented with Swagger.

## Features

-  CRUD operations for tracks
-  Search and filter functionality
-  Toggle played status
-  Interactive Swagger documentation
-  CORS enabled

## API Endpoints

 GET | `/tracks` | List all tracks (with optional filters) 
 GET | `/tracks/:id` | Get specific track 
 POST | `/tracks` | Add new track 
 PATCH | `/tracks/:id` | Update track 
 POST | `/tracks/:id/toggle` | Toggle played status 
 DELETE | `/tracks/:id` | Delete track 
 GET | `/docs` | Swagger documentation 

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone <repository-url>
cd playlist-api-assignment
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

API will be available at `https://playlist-api-assignment-m138.onrender.com`

Swagger docs at `https://playlist-api-assignment-m138.onrender.com/docs`

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Documentation**: Swagger/OpenAPI 3.0
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
src/
├── app.js          # Express app and routes
├── store.js        # Data storage and business logic
└── swagger.js      # Swagger configuration
server.js           # Server entry point
package.json        # Dependencies and scripts
```

## License

ISC