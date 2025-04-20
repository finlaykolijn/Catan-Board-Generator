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
  
  // For pointy-top hexagons:
  // Width is sqrt(3) * size, height is 2 * size
  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  
  // Define the number of hexes per row in a standard Catan board
  const rows = [3, 4, 5, 4, 3]; 
  
  // Start at a fixed position
  let yPos = 0;
  
  for (let row = 0; row < rows.length; row++) {
    const hexesInRow = rows[row];
    
    // Center the board overall, not each row individually
    // This ensures rows mesh properly in a honeycomb pattern
    const totalBoardWidth = Math.sqrt(3) * hexSize * 5; // Width of the widest row (5 hexes)
    const rowWidth = hexWidth * hexesInRow; // Calculate without extra spacing
    
    // Base row offset to center the row
    let rowOffset = (totalBoardWidth - rowWidth) / 2;
    
    // Specifically adjust rows 2 and 4 (index 1 and 3) half-hexagon to the left
    // if (row === 1 || row === 3) {
    //   rowOffset -= hexWidth / 4;
    // }
    
    for (let col = 0; col < hexesInRow; col++) {
      // For standard honeycomb pattern, odd rows are offset by half width
      // We're not using this offset now since we're explicitly shifting rows 2 and 4
      const xOffset = 0;
      
      // Position with zero spacing between hexes in same row
      const xPos = rowOffset + col * hexWidth + xOffset;
      
      positions.push({ x: xPos, y: yPos });
    }
    
    // For tight packing, move down by exactly 3/4 of the height (1.5 * size)
    // This creates optimal vertical overlap for pointy-top hexes
    yPos += hexHeight * 0.75;
  }
  
  return positions;
}

export function generateBoard(options: BoardGeneratorOptions = {}): CatanBoard {
  const hexSize = 25; // Reduced the hex size for initial calculation (used to be 100)
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