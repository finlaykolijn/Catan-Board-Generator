import { Group, RegularPolygon, Text, Circle, Image } from 'react-konva';
import { useEffect, useState } from 'react';
import { HexProps } from '../types/catan';
import { getResourceColor, getProbabilityDots } from '../utils/boardGenerator';
import { getResourceImage } from '../utils/resourceImages';

const HexTile: React.FC<HexProps> = ({ hex, size, useImages = false }) => {
  const { resourceType, number, x, y } = hex;
  const color = getResourceColor(resourceType);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  // Load image for the tile if useImages is true
  useEffect(() => {
    if (!useImages) return;
    
    const img = new window.Image();
    img.src = getResourceImage(resourceType);
    img.onload = () => {
      setImage(img);
    };
    
    return () => {
      // Cleanup
      img.onload = null;
    };
  }, [resourceType, useImages]);
  
  // Calculate dot positions in a circle around the number
  const renderProbabilityDots = () => {
    if (!number) return null;
    
    const dots = getProbabilityDots(number);
    if (dots === 0) return null;
    
    const dotRadius = size / 25;
    const dotDistance = size / 3.5;
    const dotColor = number === 6 || number === 8 ? 'red' : 'black';
    
    const dotElements = [];
    for (let i = 0; i < dots; i++) {
      const angle = (i * 2 * Math.PI) / dots;
      const dotX = Math.cos(angle) * dotDistance;
      const dotY = Math.sin(angle) * dotDistance;
      
      dotElements.push(
        <Circle
          key={`dot-${i}`}
          x={dotX}
          y={dotY}
          radius={dotRadius}
          fill={dotColor}
        />
      );
    }
    
    return dotElements;
  };
  
  return (
    <Group x={x} y={y}>
      {useImages && image ? (
        <Group>
          {/* If using images, use a hexagon clipping mask on the image */}
          <RegularPolygon
            sides={6}
            radius={size}
            fill={color}
            stroke="black"
            strokeWidth={1}
            rotation={0}
          />
          <Image
            image={image}
            width={size * 2}
            height={size * 2}
            offsetX={size}
            offsetY={size}
            listening={false}
          />
        </Group>
      ) : (
        <RegularPolygon
          sides={6}
          radius={size}
          fill={color}
          stroke="black"
          strokeWidth={1}
          rotation={0}
        />
      )}
      
      {number && (
        <Group>
          <Circle
            radius={size / 3}
            fill="white"
            stroke="black"
            strokeWidth={1}
          />
          <Text
            text={number.toString()}
            fontSize={size / 2.5}
            fontStyle="bold"
            fill="black"
            align="center"
            verticalAlign="middle"
            width={size / 1.5}
            height={size / 1.5}
            offsetX={size / 3}
            offsetY={size / 3}
          />
          {renderProbabilityDots()}
        </Group>
      )}
      
      {/* Resource icon or text could be added here in the future */}
    </Group>
  );
};

export default HexTile; 