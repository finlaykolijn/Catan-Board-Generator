import { Stage, Layer } from 'react-konva';
import { useState, useEffect } from 'react';
import HexTile from './HexTile';
import { generateBoard } from '../utils/boardGenerator';
import { CatanBoard as CatanBoardType, BoardGeneratorOptions } from '../types/catan';
import { preloadImages } from '../utils/resourceImages';

interface CatanBoardProps {
  options?: BoardGeneratorOptions;
  width: number;
  height: number;
  boardData?: CatanBoardType; 
}

const CatanBoard: React.FC<CatanBoardProps> = ({ options = {}, width, height, boardData }) => {
  const [board, setBoard] = useState<CatanBoardType | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const hexSize = 25;
  const useImages = options.useImages || false;
  const showBorders = options.showBorders || false;
  const isFiveSixPlayer = options.fiveAndSixPlayerExpansion || false;
  
  // Preload images when useImages option changes
  useEffect(() => {
    if (useImages) {
      preloadImages()
        .then(() => setImagesLoaded(true))
        .catch(error => console.error('Error preloading images:', error));
    }
  }, [useImages]);
  
  // Use provided board data or generate a new one only on initial mount
  useEffect(() => {
    if (boardData) {
      setBoard(boardData);
    } else {
      setBoard(generateBoard(options));
    }
  }, [boardData]);
  
  if (!board) {
    return <div>Loading...</div>;
  }
  
  if (useImages && !imagesLoaded) {
    return <div>Loading images...</div>;
  }
  
  // For hexagons with pointed top (not flat)
  //const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  
  // Calculate the board dimensions based on the honeycomb layout and board type
  const maxHexesInRow = isFiveSixPlayer ? 6 : 5; // 5 & 6 player board has max 6 hexes in a row
  const numRows = isFiveSixPlayer ? 7 : 5; // 5 & 6 player board has 7 rows
  
  const boardWidth = Math.sqrt(3) * hexSize * maxHexesInRow;
  const boardHeight = hexHeight * 0.75 * (numRows - 1) + hexHeight * 0.25;
  
  // Need to adjust to fit the board properly for pointed top hexes
  const scaleFactor = Math.min(
    width / boardWidth * 0.75, // Use 75% of available width for better fit
    height / boardHeight * 0.75 // Use 75% of available height for better fit
  );
  
  // Calculate the center of the board based on hexagon positions
  const hexPositions = board.hexes.map(hex => ({ x: hex.x, y: hex.y }));
  const minX = Math.min(...hexPositions.map(pos => pos.x));
  const maxX = Math.max(...hexPositions.map(pos => pos.x));
  const minY = Math.min(...hexPositions.map(pos => pos.y));
  const maxY = Math.max(...hexPositions.map(pos => pos.y));
  
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  return (
    <Stage width={width} height={height}>
      <Layer
        offsetX={centerX - width / (2 * scaleFactor)}
        offsetY={centerY - height / (2 * scaleFactor)}
        scaleX={scaleFactor}
        scaleY={scaleFactor}
      >
        {board.hexes.map((hex) => (
          <HexTile 
            key={hex.id} 
            hex={hex} 
            size={hexSize} 
            useImages={useImages}
            showBorders={showBorders}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default CatanBoard; 