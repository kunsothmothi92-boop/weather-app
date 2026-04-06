import WeatherCardBase from './WeatherCardBase';
import type { HyperlocalForecastOutput } from '@/ai/flows/hyperlocal-forecast';
import { Sparkles, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HyperlocalForecastCardProps {
  data: HyperlocalForecastOutput | null;
  isLoading: boolean;
}

const HyperlocalForecastCard: React.FC<HyperlocalForecastCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <WeatherCardBase title="Hyperlocal Forecast" icon={Sparkles}>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </WeatherCardBase>
    );
  }
  
  if (!data) {
    return (
      <WeatherCardBase title="Hyperlocal Forecast" icon={Sparkles}>
        <p className="text-muted-foreground">Hyperlocal forecast will appear here once a location is entered.</p>
      </WeatherCardBase>
    );
  }

  return (
    <WeatherCardBase title="Hyperlocal Forecast" icon={Sparkles}>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          {data.locationName}
        </h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.forecast}</p>
      </div>
    </WeatherCardBase>
  );
};

export default HyperlocalForecastCard;
