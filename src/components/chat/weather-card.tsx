"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  Snowflake,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherData {
  location_name?: string;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
  };
}

interface WeatherCardProps {
  data?: WeatherData;
  isLoading?: boolean;
}

// Helper to convert English digits to Bangla
const toBanglaDigits = (num: number | string) => {
  const english = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const bangla = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((char) => {
      const index = english.indexOf(char);
      return index > -1 ? bangla[index] : char;
    })
    .join("");
};

export function WeatherCard({ data, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-sm overflow-hidden border-violet-200/20 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32 bg-slate-800" />
          <Skeleton className="h-4 w-24 bg-slate-800" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-16 w-16 rounded-full bg-slate-800" />
            <Skeleton className="h-12 w-20 bg-slate-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-800" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.current) return null;

  const {
    weather_code,
    temperature_2m,
    relative_humidity_2m,
    apparent_temperature,
  } = data.current;

  // WMO Weather Code Mapping
  const getWeatherInfo = (code: number) => {
    switch (code) {
      case 0:
        return {
          icon: <Sun className="h-12 w-12 text-yellow-400" />,
          label: "আকাশ পরিষ্কার",
          gradient: "from-blue-500/20 to-blue-900/40",
          border: "border-blue-500/30",
        };
      case 1:
      case 2:
      case 3:
        return {
          icon: <CloudSun className="h-12 w-12 text-yellow-200" />,
          label: "আংশিক মেঘলা",
          gradient: "from-blue-400/20 to-slate-800/40",
          border: "border-blue-400/30",
        };
      case 45:
      case 48:
        return {
          icon: <Cloud className="h-12 w-12 text-slate-400" />,
          label: "কুয়াশাচ্ছন্ন",
          gradient: "from-slate-500/20 to-slate-900/40",
          border: "border-slate-500/30",
        };
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
        return {
          icon: <CloudRain className="h-12 w-12 text-blue-400" />,
          label: "বৃষ্টি",
          gradient: "from-slate-600/20 to-slate-900/40",
          border: "border-blue-500/30",
        };
      case 71:
      case 73:
      case 75:
      case 77:
        return {
          icon: <Snowflake className="h-12 w-12 text-cyan-200" />,
          label: "তুষারপাত",
          gradient: "from-cyan-500/20 to-slate-900/40",
          border: "border-cyan-500/30",
        };
      case 80:
      case 81:
      case 82:
        return {
          icon: <CloudRain className="h-12 w-12 text-blue-500" />,
          label: "ভারী বৃষ্টি",
          gradient: "from-slate-700/20 to-slate-950/40",
          border: "border-slate-500/30",
        };
      case 95:
      case 96:
      case 99:
        return {
          icon: <Wind className="h-12 w-12 text-purple-400" />,
          label: "বজ্রঝড়",
          gradient: "from-purple-500/20 to-slate-900/40",
          border: "border-purple-500/30",
        };
      default:
        return {
          icon: <Sun className="h-12 w-12 text-yellow-400" />,
          label: "অজানা",
          gradient: "from-slate-800 to-slate-950",
          border: "border-slate-700",
        };
    }
  };

  const weatherInfo = getWeatherInfo(weather_code);

  return (
    <Card
      className={cn(
        "w-full max-w-sm overflow-hidden backdrop-blur-sm shadow-xl",
        "bg-gradient-to-br",
        weatherInfo.gradient,
        weatherInfo.border,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          {data.location_name || "অবস্থান"}
        </CardTitle>
        <CardDescription className="text-slate-300">
          বর্তমান আবহাওয়া
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {weatherInfo.icon}
            <div>
              <div className="text-4xl font-bold text-slate-100">
                {toBanglaDigits(Math.round(temperature_2m))}°C
              </div>
              <div className="text-sm font-medium text-slate-300">
                {weatherInfo.label}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-xl bg-slate-950/30 p-3 border border-white/10">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Thermometer className="h-3 w-3" /> অনুভূতি
            </span>
            <span className="text-lg font-semibold text-slate-200">
              {toBanglaDigits(Math.round(apparent_temperature))}°
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-slate-950/30 p-3 border border-white/10">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Droplets className="h-3 w-3" /> আর্দ্রতা
            </span>
            <span className="text-lg font-semibold text-slate-200">
              {toBanglaDigits(relative_humidity_2m)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
