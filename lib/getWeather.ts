// lib/getWeather.ts
export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  name: string;
}

export async function getWeather(city: string): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY; // store your API key in .env.local
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather");
    const data: WeatherData = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
