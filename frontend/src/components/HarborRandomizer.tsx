import { Group, Image } from 'react-konva';
import { useEffect, useState, useMemo } from 'react';
import { HarborType } from '../types/catan';

// Import harbor images
import woodHarborImg from '../assets/images/border/wood-harbor.png';
import wheatHarborImg from '../assets/images/border/wheat-harbor.png';
import oreHarborImg from '../assets/images/border/ore-harbor.png';
import sheepHarborImg from '../assets/images/border/sheep-harbor.png';
import brickHarborImg from '../assets/images/border/brick-harbor.png';
import threeForOneHarborImg from '../assets/images/border/3for1-harbor.png';

interface HarborRandomizerProps {
  width: number;
  height: number;
  showHarbors?: boolean;
}

const HARBOR_IMAGES = {
  wood: woodHarborImg,
  wheat: wheatHarborImg,
  ore: oreHarborImg,
  sheep: sheepHarborImg,
  brick: brickHarborImg,
  '3for1': threeForOneHarborImg,
};

// Define all possible harbor position offsets (exact coordinates from user)
const HARBOR_POSITION_OFFSETS = [
  { x: -40, y: -45 },   // Position 1
  { x: 135, y: -45 },   // Position 2
  { x: -40, y: -520 },  // Position 3
  { x: 140, y: -515 },  // Position 4
  { x: 225, y: -195 },  // Position 5
  { x: 235, y: -360 },  // Position 6
  { x: -270, y: -290 }, // Position 7
  { x: -190, y: -435 }, // Position 8
  { x: -190, y: -130 }, // Position 9
];

// Define the harbor combination (1 of each resource + 4 3:1 harbors)
const HARBOR_COMBINATION: HarborType[] = [
  'wood', 'brick', 'ore', 'wheat', 'sheep', '3for1', '3for1', '3for1', '3for1'
];

const HarborRandomizer: React.FC<HarborRandomizerProps> = ({ 
  width, 
  height,
  showHarbors = false
}) => {
  const [imagesLoaded, setImagesLoaded] = useState<Record<HarborType, boolean>>({
    wood: false,
    wheat: false,
    ore: false,
    sheep: false,
    brick: false,
    '3for1': false,
  });

  // Load all harbor images
  useEffect(() => {
    if (!showHarbors) return;

    const loadImage = (harborType: HarborType): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          setImagesLoaded(prev => ({ ...prev, [harborType]: true }));
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load ${harborType} harbor image`));
        img.src = HARBOR_IMAGES[harborType];
      });
    };

    // Load all images
    Promise.all(Object.keys(HARBOR_IMAGES).map(harborType => loadImage(harborType as HarborType)))
      .catch(error => console.error('Error loading harbor images:', error));
  }, [showHarbors]);

  // Randomize harbor positions and types
  const randomizedHarbors = useMemo(() => {
    if (!showHarbors) return [];

    // Create a copy of position offsets and shuffle them
    const shuffledPositionOffsets = [...HARBOR_POSITION_OFFSETS].sort(() => Math.random() - 0.5);
    const shuffledHarbors = [...HARBOR_COMBINATION].sort(() => Math.random() - 0.5);

    return shuffledHarbors.map((harborType, index) => {
      const offset = shuffledPositionOffsets[index];
      return {
        harborType,
        x: (width - 40) / 2 + offset.x, // 40 is harbor width
        y: height - 40 + offset.y, // 40 is harbor height, using exact coordinates from user
      };
    });
  }, [showHarbors, width, height]);

  if (!showHarbors) {
    return null;
  }

  // Check if all images are loaded
  const allImagesLoaded = Object.values(imagesLoaded).every(loaded => loaded);
  if (!allImagesLoaded) {
    return null;
  }

  const harborWidth = 40;
  const harborHeight = 40;

  return (
    <Group>
      {randomizedHarbors.map((harbor, index) => {
        const img = new window.Image();
        img.src = HARBOR_IMAGES[harbor.harborType];
        return (
          <Image
            key={`${harbor.harborType}-${index}`}
            image={img}
            x={harbor.x}
            y={harbor.y}
            width={harborWidth}
            height={harborHeight}
            listening={false}
          />
        );
      })}
    </Group>
  );
};

export default HarborRandomizer;
