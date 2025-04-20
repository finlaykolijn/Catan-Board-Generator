import { ResourceType, ResourceImages } from '../types/catan';

// Resource images - currently not working
export const resourceImages: ResourceImages = {
  'forest': '/src/assets/images/forest.png',
  'pasture': '/src/assets/images/pasture.png',
  'fields': '/src/assets/images/fields.png',
  'hills': '/src/assets/images/hills.png',
  'mountains': '/src/assets/images/mountains.png',
  'desert': '/src/assets/images/desert.png',
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