import sharp from 'sharp';

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

export async function compressImage(
  imageBuffer: Buffer, 
  options: CompressionOptions = {}
): Promise<{ buffer: Buffer; info: { size: number; format: string; width: number; height: number } }> {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 40, // More aggressive compression (was 70)
    format = 'jpeg'
  } = options;

  try {
    const sharpInstance = sharp(imageBuffer);
    const metadata = await sharpInstance.metadata();

    // Resize if image is larger than specified dimensions
    let resized = sharpInstance;
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        resized = sharpInstance.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
    }

    // Apply compression based on format
    let compressed;
    switch (format) {
      case 'webp':
        compressed = resized.webp({ quality, effort: 6 });
        break;
      case 'jpeg':
        compressed = resized.jpeg({ 
          quality, 
          progressive: true,
          mozjpeg: true // Better compression
        });
        break;
      case 'png':
        compressed = resized.png({ 
          compressionLevel: 9,
          palette: true // Reduce colors for smaller size
        });
        break;
      default:
        compressed = resized.jpeg({ quality, progressive: true });
    }

    const { data, info } = await compressed.toBuffer({ resolveWithObject: true });

    return {
      buffer: data,
      info: {
        size: data.length,
        format: info.format,
        width: info.width,
        height: info.height
      }
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to compress image');
  }
}

export function getImageCompressionSettings(originalSize: number): CompressionOptions {
  // More aggressive compression for larger images
  if (originalSize > 5 * 1024 * 1024) { // 5MB+
    return { maxWidth: 600, maxHeight: 450, quality: 30, format: 'jpeg' };
  } else if (originalSize > 2 * 1024 * 1024) { // 2MB+
    return { maxWidth: 700, maxHeight: 525, quality: 35, format: 'jpeg' };
  } else if (originalSize > 1 * 1024 * 1024) { // 1MB+
    return { maxWidth: 800, maxHeight: 600, quality: 40, format: 'jpeg' };
  } else {
    return { maxWidth: 800, maxHeight: 600, quality: 50, format: 'jpeg' };
  }
}

export function base64ToBuffer(base64String: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

export function bufferToBase64(buffer: Buffer, format: string = 'jpeg'): string {
  return `data:image/${format};base64,${buffer.toString('base64')}`;
}