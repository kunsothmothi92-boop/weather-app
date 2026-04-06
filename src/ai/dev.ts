import { config } from 'dotenv';
config();

import '@/ai/flows/hyperlocal-forecast.ts';
import '@/ai/flows/understand-forecast-impact.ts';
import '@/ai/flows/structured-weather-forecast.ts';
import '@/ai/flows/disaster-recovery-updates.ts';
