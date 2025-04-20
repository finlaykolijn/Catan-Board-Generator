import { Hex, ResourceType, CatanBoard, BoardGeneratorOptions } from '../types/catan';

// Standard Catan has 19 hexes with specific resource distribution
const STANDARD_RESOURCE_DISTRIBUTION: ResourceType[] = [
  'forest', 'forest', 'forest', 'forest',      
  'pasture', 'pasture', 'pasture', 'pasture', 
  'fields', 'fields', 'fields', 'fields',      
  'hills', 'hills', 'hills',                   
  'mountains', 'mountains', 'mountains',      
  'desert'                                     
];

// Standard Catan number tokens
const STANDARD_NUMBER_DISTRIBUTION: number[] = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12
];

// Probability distribution based on standard token values
const NUMBER_PROBABILITIES: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1
};

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Calculate hex positions for a standard Catan board
function calculateHexPositions(hexSize: number): { x: number, y: number }[] {
  const positions: { x: number, y: number }[] = [];
  const hexHeight = hexSize * 2;
  const hexWidth = Math.sqrt(3) * hexSize;
  
  // Define the number of hexes per row in a standard Catan board
  const rows = [3, 4, 5, 4, 3]; 
  
  // Width is now 2*size, height is sqrt(3)*size
  const flatHexWidth = hexSize * 2;
  const flatHexHeight = Math.sqrt(3) * hexSize;
  
  // Rows are offset for proper hex tiling
  // Each row is offset horizontally by half of a hex width for odd rows
  let yPos = 0;
  
  for (let row = 0; row < rows.length; row++) {
    const hexesInRow = rows[row];
    const rowOffset = (5 - hexesInRow) * flatHexWidth / 2; // Center the row
    
    for (let col = 0; col < hexesInRow; col++) {
      // Calculate the x position, offset alternating rows
      const staggerOffset = row % 2 === 0 ? 0 : flatHexWidth / 2;
      const xPos = rowOffset + col * flatHexWidth + staggerOffset;
      positions.push({ x: xPos, y: yPos });
    }
    
    // Move down to the next row - move by 3/4 of the hexagon height
    yPos += flatHexHeight * 0.75;
  }
  
  return positions;
}

export function generateBoard(options: BoardGeneratorOptions = {}): CatanBoard {
  const hexSize = 100; // Default hex size
  const resourceTypes = shuffle(STANDARD_RESOURCE_DISTRIBUTION);
  const numberTokens = shuffle(STANDARD_NUMBER_DISTRIBUTION);
  const positions = calculateHexPositions(hexSize);
  
  const hexes: Hex[] = [];
  let numberTokenIndex = 0;
  
  for (let i = 0; i < resourceTypes.length; i++) {
    const resourceType = resourceTypes[i];
    const position = positions[i];
    
    const hex: Hex = {
      id: `hex-${i}`,
      resourceType,
      x: position.x,
      y: position.y
    };
    
    // Add number token to all hexes except desert
    if (resourceType !== 'desert') {
      hex.number = numberTokens[numberTokenIndex++];
    }
    
    hexes.push(hex);
  }
  
  // If desert should be in the middle and isn't already
  if (options.forceDesertInMiddle) {
    const middleIndex = Math.floor(hexes.length / 2);
    const desertIndex = hexes.findIndex(hex => hex.resourceType === 'desert');
    
    if (desertIndex !== middleIndex) {
      // Swap the desert hex with the middle hex
      const middleHex = hexes[middleIndex];
      const desertHex = hexes[desertIndex];
      
      // Update resource types
      hexes[middleIndex] = { ...desertHex, resourceType: 'desert', number: undefined };
      hexes[desertIndex] = { ...middleHex, resourceType: middleHex.resourceType };
    }
  }
  
  return { hexes };
}

// Function to get colour for a resource type
export function getResourceColor(resourceType: ResourceType): string {
  switch (resourceType) {
    case 'forest': return '#1b512d';    // Dark green
    case 'pasture': return '#8bc34a';   // Light green
    case 'fields': return '#f9cd5a';    // Yellow
    case 'hills': return '#d35400';     // Brick red
    case 'mountains': return '#6d6d6d'; // Gray
    case 'desert': return '#e9dab0';    // Tan
    default: return '#ffffff';
  }
}

// Get probability dots for a number
export function getProbabilityDots(number: number): number {
  return NUMBER_PROBABILITIES[number] || 0;
} 