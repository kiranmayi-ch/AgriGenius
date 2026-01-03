'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/answer-farmer-questions.ts';
import '@/ai/flows/crop-recommendation-from-profile.ts';
import '@/ai/flows/crop-profit-prediction.ts';
import '@/ai/flows/disease-detection-from-image.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/answer-expert-questions.ts';
import '@/ai/flows/damage-cost-calculator.ts';
import '@/ai/flows/community-insights.ts';
import '@/ai/flows/pest-disease-encyclopedia.ts';
import '@/ai/flows/get-regional-averages.ts';
