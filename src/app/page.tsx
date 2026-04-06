
'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocationSearch from '@/components/weather/LocationSearch';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import ForecastCard from '@/components/weather/ForecastCard';
import HyperlocalForecastCard from '@/components/weather/HyperlocalForecastCard';
import HealthAlertsCard from '@/components/weather/HealthAlertsCard';
import CustomAlertsSettings from '@/components/weather/CustomAlertsSettings';
import DisasterRecoveryCard from '@/components/weather/DisasterRecoveryCard';

import type { CurrentWeather, Forecast, HourlyForecastItem, DailyForecastItem } from '@/types/weather';
import { hyperlocalForecast, type HyperlocalForecastOutput } from '@/ai/flows/hyperlocal-forecast';
import { understandForecastImpact, type UnderstandForecastImpactOutput } from '@/ai/flows/understand-forecast-impact';
import { structuredWeatherForecast, type StructuredWeatherForecastInput, type StructuredWeatherForecastOutput } from '@/ai/flows/structured-weather-forecast';
import { getDisasterRecoveryUpdates, type DisasterUpdatesOutput } from '@/ai/flows/disaster-recovery-updates';


import { useToast } from "@/hooks/use-toast";
import { CloudDrizzle, CloudFog, CloudHail, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Cloudy, HelpCircle, Snowflake, Sun, Tornado, Umbrella, Waves, Wind, Zap, type LucideIcon } from 'lucide-react';

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return Math.abs(hash);
};

const weatherIconsList: LucideIcon[] = [Sun, CloudSun, Cloudy, CloudRain, CloudDrizzle, CloudSnow, CloudFog, CloudLightning, Zap, Wind, CloudMoon, CloudHail, Tornado, Umbrella, Waves, Snowflake];
const weatherDescriptions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Drizzle", "Light Snow", "Foggy", "Thunderstorm", "Windy", "Clear Night", "Hail", "Tornado Risk", "Showers", "Coastal Waves", "Snowfall"];

const mapIconNameToLucide = (iconName: string | undefined): LucideIcon => {
  if (!iconName) return HelpCircle;
  const normalizedIconName = iconName.toLowerCase().replace(/\s+/g, '');
  const descriptionIndex = weatherDescriptions.findIndex(desc => desc.toLowerCase().replace(/\s+/g, '') === normalizedIconName);
  if (descriptionIndex !== -1 && weatherIconsList[descriptionIndex]) {
    return weatherIconsList[descriptionIndex];
  }
  switch (normalizedIconName) {
    case 'sunny': return Sun;
    case 'partlycloudy': return CloudSun;
    case 'cloudy': return Cloudy;
    case 'rain':
    case 'lightrain':
    case 'showers': return CloudRain;
    case 'drizzle': return CloudDrizzle;
    case 'snow':
    case 'lightsnow':
    case 'snowfall': return CloudSnow;
    case 'fog':
    case 'foggy': return CloudFog;
    case 'thunderstorm': return CloudLightning; 
    case 'windy': return Wind;
    case 'clearnight': return CloudMoon;
    case 'hail': return CloudHail;
    case 'tornadorisk': return Tornado;
    case 'waves':
    case 'coastalwaves': return Waves;
    default: return HelpCircle;
  }
};

const mockCurrentWeather = (location: string): CurrentWeather => {
  const seed = simpleHash(location.toLowerCase());
  const tempBase = (seed % 15) + 5; 
  const tempVariation = (seed % 10); 
  const descriptionIndex = seed % weatherDescriptions.length;
  return {
    locationName: location,
    temperature: tempBase + tempVariation,
    description: weatherDescriptions[descriptionIndex],
    icon: weatherIconsList[descriptionIndex] as LucideIcon,
    humidity: (seed % 50) + 40, 
    windSpeed: (seed % 20) + 5, 
    pressure: (seed % 20) + 1000, 
    uvIndex: seed % 11,
    airQuality: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups'][seed % 3],
  };
};


export default function WeatherPage() {
  const [location, setLocation] = useState<string>('New York, NY');
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [hyperlocal, setHyperlocal] = useState<HyperlocalForecastOutput | null>(null);
  const [healthImpact, setHealthImpact] = useState<UnderstandForecastImpactOutput | null>(null);
  const [disasterInfo, setDisasterInfo] = useState<DisasterUpdatesOutput | null>(null);

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    weather: true, 
    hyperlocal: true,
    health: true,
    disaster: true,
  });

  const { toast } = useToast();

  const fetchDataForLocation = useCallback(async (loc: string) => {
    setLocation(loc);
    setIsLoading({ weather: true, hyperlocal: true, health: true, disaster: true });
    
    let currentWeatherData = mockCurrentWeather(loc);

    setCurrentWeather(currentWeatherData);
    setForecast(null); 
    setHyperlocal(null); 
    setHealthImpact(null);
    setDisasterInfo(null);

    let hyperlocalDataActual: HyperlocalForecastOutput | null = null;

    try {
      hyperlocalDataActual = await hyperlocalForecast({ location: loc });
      setHyperlocal(hyperlocalDataActual);
      if (hyperlocalDataActual?.forecast) {
        const highTempRegex = /high (?:of |near |is |around |is approximately |will be |will reach |being )?(\d+)\s*°?C/i;
        const match = hyperlocalDataActual.forecast.match(highTempRegex);
        if (match && match[1]) {
          const temp = parseInt(match[1], 10);
          currentWeatherData.temperature = temp; 
        }
      }
      if (hyperlocalDataActual?.locationName) {
        currentWeatherData.locationName = hyperlocalDataActual.locationName;
      }
      setCurrentWeather({ ...currentWeatherData });
    } catch (error) {
      console.error("Hyperlocal forecast error:", error);
      toast({ title: "AI Hyperlocal Error", description: "Could not fetch hyperlocal forecast.", variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, hyperlocal: false }));
    }

    try {
      const structuredInput: StructuredWeatherForecastInput = { location: loc };
      const aiForecast = await structuredWeatherForecast(structuredInput);
      if (aiForecast.locationName && (currentWeatherData.locationName === loc || !currentWeatherData.locationName)) {
           currentWeatherData.locationName = aiForecast.locationName;
           setCurrentWeather({...currentWeatherData});
      }
      const formattedForecast: Forecast = {
        hourly: aiForecast.hourly.map(item => ({
          ...item,
          icon: mapIconNameToLucide(item.iconName),
        })),
        daily: aiForecast.daily.map(item => ({
          ...item,
          icon: mapIconNameToLucide(item.iconName),
        })),
      };
      setForecast(formattedForecast);
    } catch (error) {
      console.error("Structured forecast error:", error);
      toast({ title: "AI Detailed Forecast Error", description: "Could not fetch detailed hourly/daily forecast. Initial estimates might be shown.", variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, weather: false })); 
    }

    if (hyperlocalDataActual?.forecast) {
      setIsLoading(prev => ({ ...prev, health: true })); 
      try {
        const healthResult = await understandForecastImpact({
          location: hyperlocalDataActual.locationName || loc,
          forecast: hyperlocalDataActual.forecast, 
        });
        setHealthImpact(healthResult);
      } catch (error) {
        console.error("Health impact error:", error);
        toast({ title: "AI Health Analysis Error", description: "Could not analyze health impact.", variant: "destructive" });
      } finally {
        setIsLoading(prev => ({ ...prev, health: false }));
      }
    } else {
       setIsLoading(prev => ({ ...prev, health: false })); 
    }

    setIsLoading(prev => ({ ...prev, disaster: true }));
    try {
      const disasterResult = await getDisasterRecoveryUpdates({ location: loc });
      setDisasterInfo(disasterResult);
    } catch (error) {
      console.error("Disaster recovery info error:", error);
      toast({ title: "AI Disaster Info Error", description: "Could not fetch disaster preparedness information.", variant: "destructive" });
      setDisasterInfo({ updates: "Could not retrieve disaster preparedness information at this time. Please check official local sources.", locationName: loc });
    } finally {
      setIsLoading(prev => ({ ...prev, disaster: false }));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);


  useEffect(() => {
    fetchDataForLocation(location);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  const anyLoading = isLoading.weather || isLoading.hyperlocal || isLoading.health || isLoading.disaster;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-headline font-bold text-foreground">Weather Dashboard</h2>
          <LocationSearch onLocationSubmit={fetchDataForLocation} isLoading={anyLoading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrentWeatherCard data={currentWeather} isLoading={isLoading.hyperlocal && !currentWeather?.temperature} /> 
          <HyperlocalForecastCard data={hyperlocal} isLoading={isLoading.hyperlocal} />
          <ForecastCard data={forecast} isLoading={isLoading.weather} />
          <HealthAlertsCard
            data={healthImpact}
            isLoading={isLoading.health}
            needsForecast={!hyperlocal?.forecast && !isLoading.hyperlocal && !isLoading.health} 
          />
          <CustomAlertsSettings />
          <DisasterRecoveryCard 
            data={disasterInfo} 
            isLoading={isLoading.disaster}
            currentLocationQuery={location}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

