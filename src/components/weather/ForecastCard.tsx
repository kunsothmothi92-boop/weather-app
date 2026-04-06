import WeatherCardBase from './WeatherCardBase';
import type { Forecast, HourlyForecastItem, DailyForecastItem } from '@/types/weather';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CalendarDays, Sun } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface ForecastCardProps {
  data: Forecast | null;
  isLoading: boolean;
}

const ForecastItemDisplay: React.FC<{ item: HourlyForecastItem | DailyForecastItem, type: 'hourly' | 'daily' }> = ({ item, type }) => {
  const ConditionIcon = item.icon || Sun;
  return (
    <div className="flex flex-col items-center p-3 border rounded-lg bg-background hover:bg-secondary/30 transition-colors min-w-[100px] text-center">
      <p className="text-sm font-medium">
        {type === 'hourly' ? (item as HourlyForecastItem).time : (item as DailyForecastItem).day}
      </p>
      <ConditionIcon className="h-8 w-8 my-2 text-primary" />
      {type === 'hourly' ? (
        <p className="text-lg font-semibold">{(item as HourlyForecastItem).temperature}°C</p>
      ) : (
        <p className="text-sm">
          <span className="font-semibold">{(item as DailyForecastItem).high}°</span> / {(item as DailyForecastItem).low}°
        </p>
      )}
      <p className="text-xs text-muted-foreground capitalize mt-1">{item.description}</p>
    </div>
  );
};


const ForecastCard: React.FC<ForecastCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <WeatherCardBase title="Forecast" icon={CalendarDays}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" /> {/* TabsList */}
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32 w-24 rounded-lg" />)}
          </div>
        </div>
      </WeatherCardBase>
    );
  }

  if (!data) {
    return (
      <WeatherCardBase title="Forecast" icon={CalendarDays}>
        <p className="text-muted-foreground">Forecast data is unavailable.</p>
      </WeatherCardBase>
    );
  }

  return (
    <WeatherCardBase title="Forecast" icon={CalendarDays}>
      <Tabs defaultValue="hourly">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="hourly" className="gap-2"><Clock className="h-4 w-4" />Hourly</TabsTrigger>
          <TabsTrigger value="daily" className="gap-2"><CalendarDays className="h-4 w-4" />Daily</TabsTrigger>
        </TabsList>
        <TabsContent value="hourly">
          {data.hourly.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {data.hourly.map((item, index) => (
                  <ForecastItemDisplay key={index} item={item} type="hourly" />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">Hourly forecast data is unavailable.</p>
          )}
        </TabsContent>
        <TabsContent value="daily">
          {data.daily.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {data.daily.map((item, index) => (
                  <ForecastItemDisplay key={index} item={item} type="daily" />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">Daily forecast data is unavailable.</p>
          )}
        </TabsContent>
      </Tabs>
    </WeatherCardBase>
  );
};

export default ForecastCard;
