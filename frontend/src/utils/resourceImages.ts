import { ResourceType, ResourceImages } from '../types/catan';

// Import images directly to let Vite handle asset processing
import forestImg from '../assets/images/resources/forest.png';
import pastureImg from '../assets/images/resources/pasture.png';
import fieldImg from '../assets/images/resources/field.png';
import hillImg from '../assets/images/resources/hill.png';
import mountainImg from '../assets/images/resources/mountain.png';
import desertImg from '../assets/images/resources/desert.png';

// Resource images
export const resourceImages: ResourceImages = {
  'forest': forestImg,
  'pasture': pastureImg,
  'fields': fieldImg,
  'hills': hillImg,
  'mountains': mountainImg,
  'desert': desertImg,
};

// Function to get the image path for a resource type
export function getResourceImage(resourceType: ResourceType): string {
  return resourceImages[resourceType] || '';
}

// Function to preload all images to avoid loading delays during rendering
export function preloadImages(): Promise<void[]> {
  const imagePromises = Object.values(resourceImages).map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  });
  
  return Promise.all(imagePromises);
} 