import { join } from 'path';
import fs from 'fs/promises';

class AnalysisService {
    constructor() {
        this.analysisDir = join(process.cwd(), 'data', 'analysis');
        this.ensureDirectories();
    }

    async ensureDirectories() {
        try {
            await fs.mkdir(this.analysisDir, { recursive: true });
        } catch (error) {
            console.error('Error creating directories:', error);
        }
    }

    async saveAnalysis(userId, documentId, result) {
        try {
            const analysis = {
                id: `${documentId}_${Date.now()}`,
                userId,
                documentId,
                timestamp: new Date().toISOString(),
                result,
                status: this._determineStatus(result)
            };

            const filePath = join(this.analysisDir, `${analysis.id}.json`);
            await fs.writeFile(filePath, JSON.stringify(analysis, null, 2));

            return analysis;
        } catch (error) {
            console.error('Error saving analysis:', error);
            throw error;
        }
    }

    _determineStatus(result) {
        if (result.anomaly_score > 0.8) {
            return 'high_risk';
        } else if (result.anomaly_score > 0.5) {
            return 'medium_risk';
        } else if (result.anomaly_score > 0.3) {
            return 'low_risk';
        } else {
            return 'safe';
        }
    }

    async getAnalysisByDocument(documentId) {
        try {
            const files = await fs.readdir(this.analysisDir);
            const analysisFiles = files.filter(file => file.startsWith(documentId));

            if (analysisFiles.length === 0) {
                return null;
            }

            const filePath = join(this.analysisDir, analysisFiles[0]);
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Error getting analysis:', error);
            throw error;
        }
    }

    async getUserAnalysisHistory(userId) {
        try {
            const files = await fs.readdir(this.analysisDir);
            const analyses = [];

            for (const file of files) {
                const filePath = join(this.analysisDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const analysis = JSON.parse(content);

                if (analysis.userId === userId) {
                    analyses.push(analysis);
                }
            }

            // Sort by timestamp, most recent first
            return analyses.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
        } catch (error) {
            console.error('Error getting user analysis history:', error);
            throw error;
        }
    }

    async getAnalysisStats(userId) {
        try {
            const analyses = await this.getUserAnalysisHistory(userId);
            
            const stats = {
                total: analyses.length,
                byRisk: {
                    high_risk: 0,
                    medium_risk: 0,
                    low_risk: 0,
                    safe: 0
                },
                byType: {
                    image_manipulation: 0,
                    text_inconsistency: 0,
                    metadata_issues: 0
                }
            };

            for (const analysis of analyses) {
                // Count by risk level
                stats.byRisk[analysis.status]++;

                // Count by type of issue
                if (analysis.result.forgery_probability > 0.7) {
                    stats.byType.image_manipulation++;
                }
                if (Object.values(analysis.result.text_analysis).some(v => v)) {
                    stats.byType.text_inconsistency++;
                }
                if (analysis.result.text_analysis.metadata_issues) {
                    stats.byType.metadata_issues++;
                }
            }

            return stats;
        } catch (error) {
            console.error('Error getting analysis stats:', error);
            throw error;
        }
    }

    async cleanupOldAnalyses() {
        try {
            const files = await fs.readdir(this.analysisDir);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            for (const file of files) {
                const filePath = join(this.analysisDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const analysis = JSON.parse(content);

                if (new Date(analysis.timestamp) < thirtyDaysAgo) {
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            console.error('Error cleaning up analyses:', error);
        }
    }
}

export const analysisService = new AnalysisService();
