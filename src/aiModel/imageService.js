import sharp from 'sharp';
import tesseract from 'node-tesseract-ocr';
import { join } from 'path';
import fs from 'fs/promises';

class ImageService {
    constructor() {
        this.tempDir = join(process.cwd(), 'temp');
        this.ensureDirectories();
    }

    async ensureDirectories() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (error) {
            console.error('Error creating directories:', error);
        }
    }

    async preprocessImage(inputPath) {
        try {
            const outputPath = join(this.tempDir, `preprocessed_${Date.now()}.png`);
            
            // Preprocess image using sharp
            await sharp(inputPath)
                .resize(1024, 1024, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .normalize() // Enhance contrast
                .sharpen() // Improve text clarity
                .png()
                .toFile(outputPath);

            return outputPath;
        } catch (error) {
            console.error('Image preprocessing error:', error);
            throw error;
        }
    }

    async extractText(imagePath) {
        try {
            // OCR configuration
            const config = {
                lang: "eng",
                oem: 1,
                psm: 3,
            };

            // Extract text using Tesseract
            const text = await tesseract.recognize(imagePath, config);
            return text;
        } catch (error) {
            console.error('Text extraction error:', error);
            throw error;
        }
    }

    async analyzeImageQuality(imagePath) {
        try {
            const metadata = await sharp(imagePath).metadata();
            
            // Basic quality checks
            const quality = {
                resolution: {
                    width: metadata.width,
                    height: metadata.height,
                    isAdequate: metadata.width >= 600 && metadata.height >= 600
                },
                format: {
                    type: metadata.format,
                    isSupported: ['jpeg', 'png', 'tiff'].includes(metadata.format)
                },
                size: {
                    bytes: metadata.size,
                    isWithinLimits: metadata.size < 10 * 1024 * 1024 // 10MB limit
                }
            };

            return quality;
        } catch (error) {
            console.error('Image quality analysis error:', error);
            throw error;
        }
    }

    async cleanupTempFiles() {
        try {
            const files = await fs.readdir(this.tempDir);
            const oneHourAgo = Date.now() - (60 * 60 * 1000);

            for (const file of files) {
                const filePath = join(this.tempDir, file);
                const stats = await fs.stat(filePath);

                if (stats.mtimeMs < oneHourAgo) {
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}

export const imageService = new ImageService();
