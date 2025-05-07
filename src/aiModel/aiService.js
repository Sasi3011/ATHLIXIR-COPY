import { GoogleGenerativeAI } from '@google/generative-ai';

// TODO: Replace with your API key
const API_KEY = 'AIzaSyBdKflFa1TN3PwJJss6Mxe31GvdfNRqdQ4';
const genAI = new GoogleGenerativeAI(API_KEY);

// System prompt to give context to the AI
const systemPrompt = `You are an AI assistant for athletes and sports professionals, specializing in:
- Health and medical advice
- Training recommendations
- Injury prevention and recovery
- Sports nutrition
- Mental health and performance
- Competition preparation

Keep responses concise, practical, and focused on athlete well-being. 
If medical advice is requested, always recommend consulting with healthcare professionals.`;

class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.chatSessions = new Map();
  }

  async startChat(userId) {
    const chat = this.model.startChat({
      history: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    this.chatSessions.set(userId, chat);
    return chat;
  }

  async getChat(userId) {
    if (!this.chatSessions.has(userId)) {
      return await this.startChat(userId);
    }
    return this.chatSessions.get(userId);
  }

  async generateResponse(userId, message) {
    try {
      const chat = await this.getChat(userId);
      
      // Process message to handle special commands
      const lowerMessage = message.toLowerCase();
      
      // Health records command
      if (lowerMessage.includes('health records') || lowerMessage.includes('medical records')) {
        return {
          type: 'action',
          action: 'viewHealthRecords',
          content: "I'll help you access your health records. Please note that this is sensitive information. Would you like to:",
          options: [
            "View recent records",
            "Upload new records",
            "Share records with healthcare provider"
          ]
        };
      }

      // Nearby facilities command
      if (lowerMessage.includes('nearby') && (lowerMessage.includes('hospital') || lowerMessage.includes('clinic'))) {
        return {
          type: 'action',
          action: 'findNearbyFacilities',
          content: "I'll help you find nearby medical facilities. Would you like to search by:",
          options: [
            "Current location",
            "Specific area",
            "Specialty"
          ]
        };
      }

      // Training plan command
      if (lowerMessage.includes('training') && (lowerMessage.includes('plan') || lowerMessage.includes('schedule'))) {
        return {
          type: 'action',
          action: 'createTrainingPlan',
          content: "I can help you create a personalized training plan. What's your primary goal?",
          options: [
            "Improve performance",
            "Recovery from injury",
            "General fitness"
          ]
        };
      }

      // Regular chat response
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      // Check for potential actionable items in the response
      const actions = this._extractActions(text);
      
      return {
        type: actions.length > 0 ? 'rich' : 'text',
        content: text,
        actions: actions
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        type: 'error',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        error: error.message
      };
    }
  }

  async analyzeHealthData(userId, data) {
    try {
      const prompt = `Analyze the following health data for an athlete:
      ${JSON.stringify(data)}
      Provide insights on:
      1. Key health indicators
      2. Potential areas of concern
      3. Recommendations for improvement
      Keep the response concise and actionable.`;

      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      return {
        type: 'analysis',
        content: analysis,
        data: {
          timestamp: new Date().toISOString(),
          userId: userId,
          indicators: this._extractHealthIndicators(analysis)
        }
      };
    } catch (error) {
      console.error('Health Analysis Error:', error);
      return {
        type: 'error',
        content: 'Unable to analyze health data. Please try again later.',
        error: error.message
      };
    }
  }

  async generateTrainingPlan(userId, preferences) {
    try {
      const prompt = `Create a personalized training plan for an athlete with the following preferences:
      ${JSON.stringify(preferences)}
      Include:
      1. Weekly schedule
      2. Exercise descriptions
      3. Recovery recommendations
      4. Progress tracking metrics`;

      const result = await this.model.generateContent(prompt);
      const plan = result.response.text();

      return {
        type: 'trainingPlan',
        content: plan,
        data: {
          timestamp: new Date().toISOString(),
          userId: userId,
          schedule: this._extractTrainingSchedule(plan)
        }
      };
    } catch (error) {
      console.error('Training Plan Error:', error);
      return {
        type: 'error',
        content: 'Unable to generate training plan. Please try again later.',
        error: error.message
      };
    }
  }

  _extractActions(text) {
    const actions = [];
    const patterns = [
      { regex: /consult.*doctor|medical professional/i, action: 'scheduleConsultation' },
      { regex: /upload.*record|document/i, action: 'uploadDocument' },
      { regex: /track.*progress|monitor/i, action: 'trackProgress' },
      { regex: /find.*facility|hospital|clinic/i, action: 'findFacility' }
    ];

    patterns.forEach(({ regex, action }) => {
      if (regex.test(text)) {
        actions.push(action);
      }
    });

    return actions;
  }

  _extractHealthIndicators(analysis) {
    const indicators = {};
    const patterns = [
      { regex: /blood pressure:?\s*(\d+\/\d+)/i, key: 'bloodPressure' },
      { regex: /heart rate:?\s*(\d+)/i, key: 'heartRate' },
      { regex: /bmi:?\s*(\d+\.?\d*)/i, key: 'bmi' },
      { regex: /oxygen:?\s*(\d+)/i, key: 'oxygenLevel' }
    ];

    patterns.forEach(({ regex, key }) => {
      const match = analysis.match(regex);
      if (match) {
        indicators[key] = match[1];
      }
    });

    return indicators;
  }

  _extractTrainingSchedule(plan) {
    const schedule = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    const days = Object.keys(schedule);
    days.forEach(day => {
      const dayRegex = new RegExp(`${day}:?([^\\n]+)`, 'i');
      const match = plan.match(dayRegex);
      if (match) {
        schedule[day] = match[1].trim().split(',').map(x => x.trim());
      }
    });

    return schedule;
  }
}

export { AIService };
