import { config } from 'dotenv';
config();

import '@/ai/flows/answer-farmer-questions.ts';
import '@/ai/flows/crop-recommendation-from-profile.ts';
import '@/ai/flows/crop-profit-prediction.ts';
import '@/ai/flows/disease-detection-from-image.ts';