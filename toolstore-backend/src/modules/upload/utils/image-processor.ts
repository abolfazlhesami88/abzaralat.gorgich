const sharp = require('sharp');
import * as path from 'path';
import * as fs from 'fs/promises';

export interface ProcessedImage {
  original: string;
  thumbnail: string;
  medium: string;
  filename?: string;
  originalName?: string;
  path?: string;
}

// تبدیل به WebP + تولید سایزهای مختلف — برای Performance بهتر فرانت
export async function processProductImage(
  buffer: Buffer,
  filename: string,
  uploadDir: string,
  productId: string
): Promise<ProcessedImage> {
  const baseName = path.parse(filename).name;
  const outputDir = path.join(uploadDir, 'products', productId);
  await fs.mkdir(outputDir, { recursive: true });

  const sizes = {
    thumbnail: 300,
    medium: 800,
    original: 1600,
  };

  const results: Record<string, string> = {};

  for (const [key, width] of Object.entries(sizes)) {
    const outputFilename = `${baseName}-${key}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    await sharp(buffer)
      .resize(width, width, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    results[key] = `/uploads/products/${productId}/${outputFilename}`;
  }

  // اضافه کردن اطلاعات برای ذخیره در دیتابیس
  results['filename'] = baseName + '.webp';
  results['originalName'] = filename;
  results['path'] = `/uploads/products/${productId}/`;

  return results as unknown as ProcessedImage;
}
