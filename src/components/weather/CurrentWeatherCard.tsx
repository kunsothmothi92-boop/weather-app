import WeatherCardBase from './WeatherCardBase';
import type { CurrentWeather } from '@/types/weather';
import { Thermometer, Droplets, Wind, Gauge, MapPin, Sun } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentWeatherCardProps {
  data: CurrentWeather | null;
  isLoading: boolean;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <WeatherCardBase title="Current Weather" icon={MapPin}>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </WeatherCardBase>
    );
  }

  if (!data) {
    return (
      <WeatherCardBase title="Current Weather" icon={MapPin}>
        <p className="text-muted-foreground">Enter a location to see the current weather.</p>
      </WeatherCardBase>
    );
  }
  
  const WeatherConditionIcon = data.icon || Sun;


  return (
    <WeatherCardBase title={`Current Weather in ${data.locationName}`} icon={MapPin}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-end">
          <span className="text-6xl font-bold font-headline">{data.temperature}°</span>
          <span className="text-2xl font-medium">C</span>
        </div>
        <div className="flex items-center gap-2">
         <WeatherConditionIcon className="h-10 w-10 text-primary" />
          <p className="text-xl font-medium">{data.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left pt-4 w-full max-w-xs">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-accent" />
            <span>Humidity: {data.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-accent" />
            <span>Wind: {data.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-accent" />
            <span>Pressure: {data.pressure} hPa</span>
          </div>
          {data.uvIndex !== undefined && (
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-accent" />
              <span>UV Index: {data.uvIndex}</span>
            </div>
          )}
        </div>
      </div>
    </WeatherCardBase>
  );
};

export default CurrentWeatherCard;
