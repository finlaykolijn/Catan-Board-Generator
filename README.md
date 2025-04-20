# Catan Board Generator

A web application that generates random Catan game boards for the popular board game "Settlers of Catan".

## Features

- Random generation of standard Catan boards
- Option to force the desert tile in the middle
- Visual representation of hexagonal tiles with resource types and number tokens
- Probability dots for number tokens (red for 6 and 8)

## Planned Future Features

- Support for Seafarers expansion
- Support for Cities & Knights expansion
- Custom preferences for resource/number distribution
- Mobile app deployment
- AWS website deployment

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

This will start the development server at http://localhost:5173 (or another port if 5173 is in use).

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- React - UI library
- TypeScript - Type safety
- Vite - Build tool and development server
- Konva - Canvas rendering for hexagonal tiles

## Game Information

The standard Catan board consists of:
- 19 hexagonal terrain tiles:
  - 4 forest tiles (produce lumber)
  - 4 pasture tiles (produce wool)
  - 4 fields tiles (produce grain)
  - 3 hills tiles (produce brick)
  - 3 mountains tiles (produce ore)
  - 1 desert tile (produces nothing)
- 18 number tokens (2-12, excluding 7)
  - Distributed according to probability of rolling that number
  - 6 and 8 are marked in red as they have the highest probability (excluding 7)

## License

This project is licensed under the MIT License.
