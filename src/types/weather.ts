import type { LucideIcon } from 'lucide-react';

export interface CurrentWeather {
  locationName: string;
  temperature: number;
  description: string;
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element); // Allow custom SVGs too
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex?: number;
  airQuality?: string; // Could be more complex (e.g., AQI value and category)
  pollenCount?: string; // Could be value and category
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);
  description: string;
}

export interface DailyForecastItem {
  day: string;
  high: number;
  low: number;
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);
  description: string;
}

export interface Forecast {
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export interface AlertSetting {
  id: string;
  label: string;
  enabled: boolean;
}
