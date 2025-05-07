import { imageService } from './imageService.js';
import { analysisService } from './analysisService.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ForgeryDetectionService {
    constructor() {
        this.imageService = imageService;
        this.analysisService = analysisService;
    }

    async analyzeDocument(filePath, userId) {
        try {
            // Preprocess the document
            const preprocessedPath = await this.imageService.preprocessImage(filePath);

            // Run ML analysis
            const mlResults = await this._runMLAnalysis(preprocessedPath);

            // Extract text content
            const textContent = await this.imageService.extractText(preprocessedPath);

            // Check document quality
            const qualityAnalysis = await this.imageService.analyzeImageQuality(preprocessedPath);

            // Combine all analysis results
            const analysisResult = {
                mlAnalysis: mlResults,
                textContent,
                quality: qualityAnalysis,
                timestamp: new Date(),
                status: this._determineStatus(mlResults)
            };

            return analysisResult;
        } catch (error) {
            console.error('Document analysis error:', error);
            throw error;
        }
    }

    async _runMLAnalysis(imagePath) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                join(__dirname, 'mlService.py'),
                imagePath
            ]);

            let analysisData = '';
            let errorData = '';

            pythonProcess.stdout.on('data', (data) => {
                analysisData += data;
            });

            pythonProcess.stderr.on('data', (data) => {
                errorData += data;
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`ML analysis failed: ${errorData}`));
                    return;
                }

                try {
                    const results = JSON.parse(analysisData);
                    resolve(results);
                } catch (error) {
                    reject(new Error(`Failed to parse ML results: ${error.message}`));
                }
            });
        });
    }

    _determineStatus(mlResults) {
        const score = mlResults.forgery_probability;
        if (score > 0.8) return 'high_risk';
        if (score > 0.5) return 'medium_risk';
        if (score > 0.3) return 'low_risk';
        return 'safe';
    }

    async getAnalysisHistory(userId) {
        return this.analysisService.getUserAnalysisHistory(userId);
    }

    async getAnalysisStats(userId) {
        return this.analysisService.getAnalysisStats(userId);
    }
}

export const forgeryDetectionService = new ForgeryDetectionService();
