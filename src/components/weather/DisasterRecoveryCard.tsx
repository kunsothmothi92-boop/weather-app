import WeatherCardBase from './WeatherCardBase';
import { TriangleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DisasterUpdatesOutput } from '@/ai/flows/disaster-recovery-updates';

interface DisasterRecoveryCardProps {
  data: DisasterUpdatesOutput | null;
  isLoading: boolean;
  currentLocationQuery: string | null; 
}

const DisasterRecoveryCard: React.FC<DisasterRecoveryCardProps> = ({ data, isLoading, currentLocationQuery }) => {
  const renderContent = () => {
    if (!currentLocationQuery && !isLoading) { // Don't show "search for location" if it's initially loading for a default location
      return <p className="text-sm text-muted-foreground">Search for a location to see relevant disaster preparedness information.</p>;
    }
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
      );
    }
    if (!data || !data.updates) {
      return <p className="text-sm text-muted-foreground">No specific disaster recovery updates available for {data?.locationName || currentLocationQuery || 'the searched location'} at this time. Always check official local sources.</p>;
    }

    const formattedUpdates = data.updates
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          return <li key={index} className="text-sm ml-4 list-disc">{trimmedLine.substring(2)}</li>;
        }
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
           return <li key={index} className="text-sm ml-4 list-disc">{trimmedLine.substring(1).trim()}</li>;
        }
        // Preserve paragraphs that are not list items
        if(trimmedLine.length > 0) {
            return <p key={index} className="text-sm leading-relaxed my-1">{trimmedLine}</p>;
        }
        return null;
      }).filter(Boolean);

    return (
      <div className="space-y-3">
        {data.locationName && (
            <h4 className="font-semibold text-md">Preparedness for {data.locationName}:</h4>
        )}
        <div className="whitespace-pre-wrap space-y-1">
            {formattedUpdates.some(el => el?.type === 'li') ? <ul>{formattedUpdates}</ul> : formattedUpdates}
        </div>
      </div>
    );
  };

  return (
    <WeatherCardBase title="Disaster Preparedness & Recovery" icon={TriangleAlert}>
      {renderContent()}
    </WeatherCardBase>
  );
};

export default DisasterRecoveryCard;
