
import WeatherCardBase from './WeatherCardBase';
import type { UnderstandForecastImpactOutput } from '@/ai/flows/understand-forecast-impact';
import { HeartPulse } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthAlertsCardProps {
  data: UnderstandForecastImpactOutput | null;
  isLoading: boolean;
  needsForecast: boolean;
}

const HealthAlertsCard: React.FC<HealthAlertsCardProps> = ({ data, isLoading, needsForecast }) => {

  const renderContent = () => {
    if (needsForecast) {
      return <p className="text-muted-foreground">Health impact analysis requires a weather forecast. Please search for a location first.</p>;
    }
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-6 w-1/2 mt-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    }
    if (!data) {
      return <p className="text-muted-foreground">Health impact analysis will appear here.</p>;
    }
    return (
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-md">Summary of Potential Health Impacts:</h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
        </div>
        <div>
          <h4 className="font-semibold text-md">Recommendations:</h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.recommendations}</p>
        </div>
      </div>
    );
  }

  return (
    <WeatherCardBase title="Health & Weather Insights" icon={HeartPulse}>
      <div className="space-y-4">
        {renderContent()}
      </div>
    </WeatherCardBase>
  );
};

export default HealthAlertsCard;
