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
}

const CatanBoard: React.FC<CatanBoardProps> = ({ options = {}, width, height }) => {
  const [board, setBoard] = useState<CatanBoardType | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const hexSize = 40;
  const useImages = options.useImages || false;
  
  // Preload images when useImages option changes
  useEffect(() => {
    if (useImages) {
      preloadImages()
        .then(() => setImagesLoaded(true))
        .catch(error => console.error('Error preloading images:', error));
    }
  }, [useImages]);
  
  useEffect(() => {
    setBoard(generateBoard(options));
  }, [options]);
  
  if (!board) {
    return <div>Loading...</div>;
  }
  
  if (useImages && !imagesLoaded) {
    return <div>Loading images...</div>;
  }
  
  // Calculate the stage scale to fit the board properly
  const scaleFactor = Math.min(
    width / (Math.sqrt(3) * hexSize * 7), // Increased width to ensure full board visibility
    height / (hexSize * 2 * 6) // Increased height to ensure full board visibility
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
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default CatanBoard; 