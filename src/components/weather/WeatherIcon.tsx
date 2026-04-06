import type { LucideIcon } from 'lucide-react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudSun, CloudMoon, CloudFog, CloudLightning, Thermometer, Droplets, Gauge, MapPin, Sparkles, HeartPulse, Bell, TriangleAlert, Search, HelpCircle, SunSnow, Cloudy, Zap, Waves, Snowflake, CloudDrizzle, CloudHail, Tornado, Umbrella, Sunrise, Sunset } from 'lucide-react';

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  cloud: Cloud,
  cloudy: Cloudy,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  snow: CloudSnow,
  sunsnow: SunSnow,
  wind: Wind,
  partlycloudyday: CloudSun,
  partlycloudynight: CloudMoon,
  fog: CloudFog,
  lightning: CloudLightning,
  thunderstorm: Zap,
  hail: CloudHail,
  tornado: Tornado,
  umbrella: Umbrella,
  sunrise: Sunrise,
  sunset: Sunset,
  waves: Waves,
  snowflake: Snowflake,
  thermometer: Thermometer,
  droplets: Droplets,
  gauge: Gauge,
  mappin: MapPin,
  sparkles: Sparkles,
  heartpulse: HeartPulse,
  bell: Bell,
  trianglealert: TriangleAlert,
  search: Search,
  default: HelpCircle, // Default icon if no match
};

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className, ...props }) => {
  const IconComponent = iconMap[iconName.toLowerCase().replace(/\s+/g, '')] || iconMap.default;
  return <IconComponent className={cn("h-6 w-6", className)} {...props} />;
};

// cn utility for class names (assuming it's in lib/utils)
// If not, define a simple version here or import if available.
// For this example, I'll assume cn is globally available or properly imported where used.
 function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}


export default WeatherIcon;
