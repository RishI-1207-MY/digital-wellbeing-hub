
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Thermometer, Droplet } from 'lucide-react';

// Mock vitals data generator
const generateVitalsData = () => {
  return {
    heartRate: Math.floor(Math.random() * (90 - 65) + 65),
    bloodPressure: {
      systolic: Math.floor(Math.random() * (140 - 110) + 110),
      diastolic: Math.floor(Math.random() * (90 - 70) + 70)
    },
    temperature: (Math.random() * (99.2 - 97.6) + 97.6).toFixed(1),
    oxygenLevel: Math.floor(Math.random() * (100 - 95) + 95)
  };
};

const VitalsDisplay = () => {
  const [vitals, setVitals] = useState(generateVitalsData());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(generateVitalsData());
      setLastUpdated(new Date());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return 'low';
    if (rate > 100) return 'high';
    return 'normal';
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic > 140 || diastolic > 90) return 'high';
    if (systolic < 90 || diastolic < 60) return 'low';
    return 'normal';
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 99.5) return 'high';
    if (temp < 97.0) return 'low';
    return 'normal';
  };

  const getOxygenStatus = (level: number) => {
    if (level < 92) return 'low';
    return 'normal';
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-lifesage-danger';
      case 'low': return 'text-lifesage-warning';
      default: return 'text-lifesage-success';
    }
  };

  const heartRateStatus = getHeartRateStatus(vitals.heartRate);
  const bloodPressureStatus = getBloodPressureStatus(vitals.bloodPressure.systolic, vitals.bloodPressure.diastolic);
  const temperatureStatus = getTemperatureStatus(parseFloat(vitals.temperature));
  const oxygenStatus = getOxygenStatus(vitals.oxygenLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Vitals</CardTitle>
        <CardDescription>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
            <div className={`p-3 mr-4 rounded-full ${statusColor(heartRateStatus)} bg-opacity-10`}>
              <Heart className={statusColor(heartRateStatus)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Heart Rate</p>
              <p className={`text-xl font-semibold ${statusColor(heartRateStatus)}`}>
                {vitals.heartRate} <span className="text-sm">BPM</span>
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
            <div className={`p-3 mr-4 rounded-full ${statusColor(bloodPressureStatus)} bg-opacity-10`}>
              <Activity className={statusColor(bloodPressureStatus)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Pressure</p>
              <p className={`text-xl font-semibold ${statusColor(bloodPressureStatus)}`}>
                {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic} <span className="text-sm">mmHg</span>
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
            <div className={`p-3 mr-4 rounded-full ${statusColor(temperatureStatus)} bg-opacity-10`}>
              <Thermometer className={statusColor(temperatureStatus)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Temperature</p>
              <p className={`text-xl font-semibold ${statusColor(temperatureStatus)}`}>
                {vitals.temperature}° <span className="text-sm">F</span>
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
            <div className={`p-3 mr-4 rounded-full ${statusColor(oxygenStatus)} bg-opacity-10`}>
              <Droplet className={statusColor(oxygenStatus)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Oxygen Level</p>
              <p className={`text-xl font-semibold ${statusColor(oxygenStatus)}`}>
                {vitals.oxygenLevel}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalsDisplay;
