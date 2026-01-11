import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Tool 1: Get Coordinates
export const getCoordinates = tool(
  async ({ city }) => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city,
        )}&count=1&language=en&format=json`,
        { cache: "no-store" },
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return JSON.stringify({ error: "City not found" });
      }

      const result = data.results[0];
      return JSON.stringify({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
      });
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return JSON.stringify({ error: "Failed to fetch coordinates" });
    }
  },
  {
    name: "get_coordinates",
    description: "Fetches latitude and longitude for a given city name.",
    schema: z.object({
      city: z.string().describe("The city name to find coordinates for"),
    }),
  },
);

// Tool 2: Get Weather
export const getWeatherTool = tool(
  async ({ lat, lng, location_name }) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=auto`,
        { cache: "no-store" },
      );
      const data = await response.json();

      if (data.error) {
        return JSON.stringify({ error: "Failed to fetch weather data" });
      }

      // Merge the location name into the result for the UI
      return JSON.stringify({
        location_name,
        current: data.current,
        current_units: data.current_units,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      return JSON.stringify({ error: "Failed to fetch weather data" });
    }
  },
  {
    name: "get_weather",
    description:
      "Fetches current weather using latitude and longitude. Execute this AFTER getting coordinates.",
    schema: z.object({
      lat: z.number().describe("Latitude of the location"),
      lng: z.number().describe("Longitude of the location"),
      location_name: z
        .string()
        .optional()
        .describe("Name of the location (city) to display"),
    }),
  },
);
