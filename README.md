# Catan Board Generator

A web application that generates random Catan game boards with customizable options and community board sharing.

**Live Demo**: You can view the production version at [catanboardgenerator.ca](https://catanboardgenerator.ca)

**Development Version**: To view the latest development features, clone the repository and run locally (see setup instructions below).

## Features

- **Random Board Generation**: Generate standard Catan boards with customizable options
- **Visual Representation**: Hexagonal tiles with resource types and number tokens
- **Probability Dots**: Visual indicators for number token probabilities
- **Board Customization**:
  - Toggle resource images vs. text labels
  - Show/hide hex borders
  - Force desert in center position
  - Resource bias preferences
  - Adjacency rules for high-probability numbers (6 & 8, 2 & 12)
- **Community Boards**: Save and share boards with the community
- **5 & 6 Player Expansion**: Support for larger board layouts
- **Board Preferences**: Customizable visual and generation settings

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL (for community features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Catan-Board-Generator.git
cd Catan-Board-Generator
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Environment Setup

1. Create a `.env` file in the root directory with your database credentials:
```bash
DB_USER=your_username
DB_PASS=your_password
DB_NAME=catandb
DB_HOST=localhost
```

2. Set up the database:
```bash
docker-compose up -d db
```

### Running the Application

#### Option 1: Run Frontend Only (Basic Features)
```bash
cd frontend
npm run dev
```
This will start the frontend at http://localhost:5173 with basic board generation features.

#### Option 2: Run Full Stack (All Features)
1. Start the backend:
```bash
cd backend
npm start
```
The backend will run on http://localhost:3001

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

3. Access the application at http://localhost:5173

### Docker Setup (Alternative)

For a complete setup with PostgreSQL:
```bash
docker-compose up -d
```

## Technologies Used

- **Frontend**:
  - React 19 with TypeScript
  - Vite for build tooling
  - Konva for canvas rendering
  - CSS for styling

- **Backend**:
  - Node.js with Express
  - PostgreSQL for data storage
  - CORS enabled for cross-origin requests

## Game Information

The standard Catan board consists of:
- **19 hexagonal terrain tiles**:
  - 4 forest tiles (produce lumber)
  - 4 pasture tiles (produce wool)
  - 4 fields tiles (produce grain)
  - 3 hills tiles (produce brick)
  - 3 mountains tiles (produce ore)
  - 1 desert tile (produces nothing)
- **18 number tokens** (2-12, excluding 7):
  - Distributed according to probability of rolling that number
  - 6 and 8 are marked in red as they have the highest probability (excluding 7)

## Development

### Project Structure
```
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── types/       # TypeScript type definitions
│   │   └── utils/       # Utility functions
│   └── package.json
├── backend/           # Node.js Express API
│   ├── index.js       # Main server file
│   └── package.json
└── docker-compose.yml # Docker configuration
```

### Available Scripts

**Frontend**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend**:
- `npm start` - Start the server

## License

This project is licensed under the MIT License.
