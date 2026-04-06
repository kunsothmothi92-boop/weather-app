'use client';

import WeatherCardBase from './WeatherCardBase';
import type { AlertSetting } from '@/types/weather';
import { BellPlus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

const initialAlertSettings: AlertSetting[] = [
  { id: 'severeWeather', label: 'Severe Weather Alerts (e.g., storms, high winds)', enabled: true },
  { id: 'precipitation', label: 'Precipitation starting/stopping soon', enabled: false },
  { id: 'uvIndex', label: 'High UV Index Warning', enabled: true },
  { id: 'airQuality', label: 'Poor Air Quality Alert', enabled: false },
  { id: 'tempChange', label: 'Significant Temperature Drop/Increase', enabled: false },
];

const CustomAlertsSettings: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertSetting[]>(initialAlertSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem('weatherwiseAlertSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        if (Array.isArray(parsedSettings) && parsedSettings.every(s => 'id' in s && 'label' in s && 'enabled' in s)) {
          setAlerts(parsedSettings);
        } else {
          // If stored data is invalid, ensure localStorage is updated with initial settings
          localStorage.setItem('weatherwiseAlertSettings', JSON.stringify(initialAlertSettings));
          // No need to setAlerts if it's already initialAlertSettings and no valid stored settings were found
        }
      } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        localStorage.setItem('weatherwiseAlertSettings', JSON.stringify(initialAlertSettings));
      }
    } else {
      // If nothing in localStorage, store the initial settings
      localStorage.setItem('weatherwiseAlertSettings', JSON.stringify(initialAlertSettings));
    }
  }, []);

  const handleToggle = (id: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    );
    setAlerts(updatedAlerts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weatherwiseAlertSettings', JSON.stringify(updatedAlerts));
    }
  };
  
  return (
    <WeatherCardBase title="Custom Weather Alerts" icon={BellPlus}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Set up personalized notifications for weather conditions that matter to you. (UI demo only)
        </p>
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-secondary/20">
            <Label htmlFor={alert.id} className="text-sm flex-grow pr-4 cursor-pointer">
              {alert.label}
            </Label>
            <Switch
              id={alert.id}
              checked={alert.enabled}
              onCheckedChange={() => handleToggle(alert.id)}
              aria-label={`Toggle ${alert.label}`}
            />
          </div>
        ))}
      </div>
    </WeatherCardBase>
  );
};

export default CustomAlertsSettings;
