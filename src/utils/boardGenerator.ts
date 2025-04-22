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

// 5 & 6 player expansion has 30 hexes with specific resource distribution
const FIVE_SIX_PLAYER_RESOURCE_DISTRIBUTION: ResourceType[] = [
  'forest', 'forest', 'forest', 'forest', 'forest', 'forest',      
  'pasture', 'pasture', 'pasture', 'pasture', 'pasture', 'pasture', 
  'fields', 'fields', 'fields', 'fields', 'fields', 'fields',      
  'hills', 'hills', 'hills', 'hills', 'hills',                   
  'mountains', 'mountains', 'mountains', 'mountains', 'mountains',      
  'desert', 'desert'                                     
];

// Standard Catan number tokens
const STANDARD_NUMBER_DISTRIBUTION: number[] = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12
];

// 5 & 6 player expansion number tokens
const FIVE_SIX_PLAYER_NUMBER_DISTRIBUTION: number[] = [
  2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12
];

// Probability distribution based on standard token values
const NUMBER_PROBABILITIES: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1
};

// Weight values
// 60% for 6 and 8
// 25% for 5 and 9
// 10% for 4 and 10
// 4% for 3 and 11
// 1% for 2 and 12
const NUMBER_WEIGHTS: Record<number, number> = {
  6: 30, 
  8: 30, 
  5: 12.5, 
  9: 12.5, 
  4: 5, 
  10: 5, 
  3: 2, 
  11: 2,
  2: 0.5, 
  12: 0.5 
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
function calculateStandardHexPositions(hexSize: number): { x: number, y: number }[] {
  const positions: { x: number, y: number }[] = [];
  
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
    const totalBoardWidth = Math.sqrt(3) * hexSize * 5; // Width of the widest row 
    const rowWidth = hexWidth * hexesInRow; // Calculate without extra spacing
    
    // Base row offset to center the row
    let rowOffset = (totalBoardWidth - rowWidth) / 2;
    
    for (let col = 0; col < hexesInRow; col++) {

      // For standard honeycomb pattern, odd rows are not offset.. should work
      const xOffset = 0;
      
      // Position with zero spacing between hexes in same row
      const xPos = rowOffset + col * hexWidth + xOffset;
      
      positions.push({ x: xPos, y: yPos });
    }
    
    // This creates optimal vertical overlap for pointy-top hexes
    yPos += hexHeight * 0.75;
  }
  
  return positions;
}

// Calculate hex positions for a 5 & 6 player Catan board
function calculateFiveSixPlayerHexPositions(hexSize: number): { x: number, y: number }[] {
  const positions: { x: number, y: number }[] = [];
  
  // Width is sqrt(3) * size, height is 2 * size
  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  
  // Define the number of hexes per row for 5 & 6 player expansion
  const rows = [3, 4, 5, 6, 5, 4, 3]; 
  
  // Start at a fixed position
  let yPos = 0;
  
  for (let row = 0; row < rows.length; row++) {
    const hexesInRow = rows[row];
    
    // Center the board overall, not each row individually
    // This ensures rows mesh properly in a honeycomb pattern
    const totalBoardWidth = Math.sqrt(3) * hexSize * 6; // Width of the widest row 
    const rowWidth = hexWidth * hexesInRow; // Calculate without extra spacing
    
    // Base row offset to center the row
    let rowOffset = (totalBoardWidth - rowWidth) / 2;
    
    for (let col = 0; col < hexesInRow; col++) {
      // Position with zero spacing between hexes in same row
      const xPos = rowOffset + col * hexWidth;
      
      positions.push({ x: xPos, y: yPos });
    }
    
    // This creates optimal vertical overlap for pointy-top hexes
    yPos += hexHeight * 0.75;
  }
  
  return positions;
}

// Improved function to select a number based on weights
function selectWeightedNumber(availableNumbers: number[]): number | null {
  if (availableNumbers.length === 0) return null;
  
  // Filter only numbers that have weights
  const numbersWithWeights = availableNumbers.filter(num => NUMBER_WEIGHTS[num] > 0);
  
  // If no numbers with weights are available, fall back to any available number
  if (numbersWithWeights.length === 0) {
    return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
  }
  
  // Calculate total weight of available numbers with weights
  let totalWeight = 0;
  for (const num of numbersWithWeights) {
    totalWeight += NUMBER_WEIGHTS[num];
  }
  
  // Generate a random value between 0 and total weight
  const randomValue = Math.random() * totalWeight;
  
  // Select a number based on its weight
  let cumulativeWeight = 0;
  for (const num of numbersWithWeights) {
    cumulativeWeight += NUMBER_WEIGHTS[num];
    if (randomValue < cumulativeWeight) {
      return num;
    }
  }
  
  // Fallback - return a random weighted number
  return numbersWithWeights[Math.floor(Math.random() * numbersWithWeights.length)];
}

export function generateBoard(options: BoardGeneratorOptions = {}): CatanBoard {
  const hexSize = 25; // Reduced the hex size for initial calculation
  
  // Determine if using 5&6 player expansion
  const isFiveSixPlayer = options.fiveAndSixPlayerExpansion || false;
  
  // Select appropriate resource distribution and number distribution
  const resourceDistribution = isFiveSixPlayer 
    ? FIVE_SIX_PLAYER_RESOURCE_DISTRIBUTION
    : STANDARD_RESOURCE_DISTRIBUTION;
    
  const numberDistribution = isFiveSixPlayer
    ? FIVE_SIX_PLAYER_NUMBER_DISTRIBUTION
    : STANDARD_NUMBER_DISTRIBUTION;
  
  const resourceTypes = shuffle([...resourceDistribution]);
  let numberTokens = [...numberDistribution]; // Don't shuffle yet
  
  // Calculate positions based on board type
  const positions = isFiveSixPlayer
    ? calculateFiveSixPlayerHexPositions(hexSize)
    : calculateStandardHexPositions(hexSize);
  
  const hexes: Hex[] = [];
  
  // Create all hexes first, without assigning numbers
  for (let i = 0; i < resourceTypes.length; i++) {
    const resourceType = resourceTypes[i];
    const position = positions[i];
    
    const hex: Hex = {
      id: `hex-${i}`,
      resourceType,
      x: position.x,
      y: position.y
    };
    
    hexes.push(hex);
  }
  
  // If desert option selected, move it to a non-edge position
  if (options.forceDesertInMiddle) {
    // Define the edge and non-edge indices based on board type
    let edgeIndices: number[] = [];
    let nonEdgeIndices: number[] = [];
    
    if (isFiveSixPlayer) {
      // Define edge and non-edge indices for 5&6 player board
      // First row: 0-2
      // Second row: 3-6
      // Third row: 7-11
      // Fourth row: 12-17
      // Fifth row: 18-22
      // Sixth row: 23-26
      // Seventh row: 27-29
      edgeIndices = [
        0, 1, 2,                      // Top row
        3, 6,                         // Second row edges
        7, 11,                        // Third row edges
        12, 17,                       // Fourth row edges
        18, 22,                       // Fifth row edges
        23, 26,                       // Sixth row edges
        27, 28, 29                    // Bottom row
      ];
      
      nonEdgeIndices = [
        4, 5,                         // Second row interior
        8, 9, 10,                     // Third row interior
        13, 14, 15, 16,               // Fourth row interior
        19, 20, 21,                   // Fifth row interior
        24, 25                        // Sixth row interior
      ];
    } else {
      // Standard board edge and non-edge indices
      edgeIndices = [0, 1, 2, 3, 6, 7, 11, 12, 15, 16, 17, 18];
      nonEdgeIndices = [4, 5, 8, 9, 10, 13, 14];
    }
    
    // Get all desert indices
    const desertIndices = hexes
      .map((hex, index) => hex.resourceType === 'desert' ? index : -1)
      .filter(index => index !== -1);
    
    // For each desert on an edge, try to move it to a non-edge position
    for (const desertIndex of desertIndices) {
      // If desert is on an edge, move it to a non-edge position
      if (edgeIndices.includes(desertIndex)) {
        // Get all available non-edge indices (that don't already have a desert)
        const availableNonEdgeIndices = nonEdgeIndices.filter(index => 
          hexes[index].resourceType !== 'desert'
        );
        
        if (availableNonEdgeIndices.length > 0) {
          // Choose a random non-edge index
          const randomNonEdgeIndex = availableNonEdgeIndices[
            Math.floor(Math.random() * availableNonEdgeIndices.length)
          ];
          
          // Get the hexes
          const desertHex = hexes[desertIndex];
          const nonEdgeHex = hexes[randomNonEdgeIndex];
          
          // Swap resources
          const nonEdgeResource = nonEdgeHex.resourceType;
          
          // Update the hexes
          hexes[randomNonEdgeIndex] = { ...nonEdgeHex, resourceType: 'desert' };
          hexes[desertIndex] = { ...desertHex, resourceType: nonEdgeResource };
        }
      }
    }
  }
  
  // Group hexes by resource type
  const hexesByResource: Record<ResourceType, Hex[]> = {
    'forest': [],
    'pasture': [],
    'fields': [],
    'hills': [],
    'mountains': [],
    'desert': []
  };
  
  hexes.forEach(hex => {
    if (hex.resourceType) {
      hexesByResource[hex.resourceType].push(hex);
    }
  });
  
  // Assign numbers based on preferences
  if (options.biasResources && options.biasResources.length > 0) {
    // Track used numbers and how many of each we can use
    const numberUsage: Record<number, number> = {};
    
    // Initialize with how many of each number we can use
    for (const num of numberDistribution) {
      numberUsage[num] = (numberUsage[num] || 0) + 1;
    }
    
    // Process preferred resources first
    const preferredHexes: Hex[] = [];
    
    // Collect all hexes from preferred resources
    for (const resourceType of options.biasResources) {
      const resourceHexes = hexesByResource[resourceType];
      if (resourceHexes && resourceHexes.length > 0) {
        preferredHexes.push(...resourceHexes);
      }
    }
    
    // Shuffle preferred hexes to avoid bias between resources
    const shuffledPreferredHexes = shuffle([...preferredHexes]);
    
    // Try to assign weighted numbers to preferred hexes first
    for (const hex of shuffledPreferredHexes) {
      // Get available numbers based on what's left in our usage count
      const availableNumbers = Object.entries(numberUsage)
        .filter(([_, count]) => count > 0)
        .map(([num]) => parseInt(num));
      
      if (availableNumbers.length > 0) {
        // Select a number using weighted probabilities
        const selectedNumber = selectWeightedNumber(availableNumbers);
        
        if (selectedNumber !== null) {
          // Assign number to hex
          hex.number = selectedNumber;
          
          // Update usage count
          numberUsage[selectedNumber]--;
          
          // Remove this number from our available tokens
          const indexToRemove = numberTokens.indexOf(selectedNumber);
          if (indexToRemove !== -1) {
            numberTokens.splice(indexToRemove, 1);
          }
        }
      }
    }
    
    // Now assign remaining numbers to non-preferred resources
    const remainingHexes = hexes.filter(hex => 
      hex.resourceType !== 'desert' && hex.number === undefined
    );
    
    // Shuffle the remaining numbers for random assignment
    const remainingNumbers = shuffle([...numberTokens]);
    
    // Assign remaining numbers
    for (let i = 0; i < remainingHexes.length; i++) {
      if (i < remainingNumbers.length) {
        remainingHexes[i].number = remainingNumbers[i];
      }
    }
  } else {
    // If no preferences, assign numbers randomly as before
    numberTokens = shuffle(numberTokens);
    let numberTokenIndex = 0;
    for (const hex of hexes) {
      if (hex.resourceType !== 'desert') {
        hex.number = numberTokens[numberTokenIndex++];
      }
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