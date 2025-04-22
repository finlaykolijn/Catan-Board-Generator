export type ResourceType = 'forest' | 'pasture' | 'fields' | 'hills' | 'mountains' | 'desert';

export interface Hex {
  id: string;
  resourceType: ResourceType;
  number?: number;
  x: number;
  y: number;
}

export interface HexProps {
  hex: Hex;
  size: number;
  useImages?: boolean;
  showBorders?: boolean;
}

export interface CatanBoard {
  hexes: Hex[];
}

export interface BoardGeneratorOptions {
  includeSeafarers?: boolean;
  includeCitiesAndKnights?: boolean;
  fiveAndSixPlayerExpansion?: boolean;
  forceDesertInMiddle?: boolean;
  biasResources?: ResourceType[];
  useImages?: boolean;
  showBorders?: boolean;
}

export interface ResourceImages {
  [key: string]: string;
} 