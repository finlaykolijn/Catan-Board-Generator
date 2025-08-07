import { Group, Image } from 'react-konva';
import { useEffect, useState } from 'react';
import { BoardGeneratorOptions } from '../types/catan';
import { getBorderImage } from '../utils/borderImages';

interface BorderProps {
  options: BoardGeneratorOptions;
  width: number;
  height: number;
  boardWidth: number;
  boardHeight: number;
}

const Border: React.FC<BorderProps> = ({ options, width, height, boardWidth, boardHeight }) => {
  const [borderImage, setBorderImage] = useState<HTMLImageElement | null>(null);

  const useFullBorder = options.useFullBorder || false;

  // Load border image
  useEffect(() => {
    if (!useFullBorder) return;

    const img = new window.Image();
    img.src = getBorderImage(useFullBorder);
    img.onload = () => {
      setBorderImage(img);
    };

    return () => {
      img.onload = null;
    };
  }, [useFullBorder]);

  if (!useFullBorder || !borderImage) {
    return null;
  }

  // Calculate border positioning to center it around the board
  // Use different scaling for width and height to better fit hexagonal shape
  const baseScale = Math.min(width / boardWidth, height / boardHeight) * 0.85;
  const borderScaleX = baseScale * 0.9275; // Stretch/Compress horizontally
  const borderScaleY = baseScale * 1.08; // Stretch/Compress vertically
  const borderX = (width - boardWidth * borderScaleX) / 2  - 1;
  const borderY = (height - boardHeight * borderScaleY) / 2 ;

  return (
    <Group>
      {/* Render the full border image */}
      <Image
        image={borderImage}
        x={borderX}
        y={borderY}
        width={boardWidth * borderScaleX}
        height={boardHeight * borderScaleY}
        listening={false}
      />
    </Group>
  );
};

export default Border; 