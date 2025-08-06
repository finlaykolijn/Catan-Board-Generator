
// Import border images directly to let Vite handle asset processing
import fullBorderImg from '../assets/images/border/full-border.png';
import fullBorderFlippedImg from '../assets/images/border/full-border-flipped.png';
import borderPieceImg from '../assets/images/border/border-piece.png';

// Border image paths
export const BORDER_IMAGES = {
  fullBorder: fullBorderImg,
  fullBorderFlipped: fullBorderFlippedImg,
  borderPiece: borderPieceImg,
};

// Function to preload border images
export function preloadBorderImages(): Promise<void> {
  const images = [
    BORDER_IMAGES.fullBorder,
    BORDER_IMAGES.fullBorderFlipped,
    BORDER_IMAGES.borderPiece,
  ];

  const promises = images.map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  });

  return Promise.all(promises).then(() => {});
}

// Function to get border image based on options
export function getBorderImage(useFullBorder: boolean = false, isFlipped: boolean = false): string {
  if (useFullBorder) {
    return isFlipped ? BORDER_IMAGES.fullBorderFlipped : BORDER_IMAGES.fullBorder;
  }
  return BORDER_IMAGES.borderPiece;
} 