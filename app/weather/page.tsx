"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

type ForecastItem = {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string }[];
};

function getClothingAdvice(temp: number) {
  if (temp < 15) return "🧥 Wear warmly (jacket, sweater)";
  if (temp < 20) return "🧢 Light jacket or sweater";
  if (temp < 27) return "👕 Lighter clothes";
  return "🌞 Very warm! Stay cool & hydrated";
}

export default function WeatherPage() {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Nairobi");
  const [searchCity, setSearchCity] = useState("Nairobi");
  const [error, setError] = useState("");

  const fetchForecast = async (cityToFetch: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityToFetch}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await res.json();

      if (data.cod !== "200") {
        throw new Error(data.message || "City not found");
      }

      const filtered = data.list.filter((_: any, i: number) => i % 8 === 0);
      setForecast(filtered);
      setCity(cityToFetch);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(city);
  }, []);
  
  if (loading)
        return (
            <div className="flex flex-col justify-center items-center h-64 text-lg font-semibold animate-pulse">
                <span className="text-blue-400 text-3xl mb-2">☁️</span>
                Loading weather...
            </div>
        );

  return (
    <div className="bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-100 min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-blue-100 overflow-hidden">
        <div className="px-8 py-6">
          {/* City Selector */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2 text-blue-700 text-center drop-shadow-lg">
              🌤️ 5-Day Weather Forecast
            </h1>
            <p className="text-blue-600 font-medium mb-4 text-center">
              Use the forecast to choose your daily outfit
            </p>

            <div className="flex items-center gap-3 mb-6">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter city (e.g., Mombasa)"
              />
              <button
                onClick={() => fetchForecast(searchCity)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow"
              >
                Get Forecast
              </button>
            </div>

            {error && (
              <div className="text-red-600 font-medium mb-4">{error}</div>
            )}

            <h2 className="text-xl font-bold text-blue-700">
              Forecast for: {city}
            </h2>
          </div>

          {/* Weather Icons Summary */}
          <div className="flex justify-center gap-2 mb-6">
            {forecast.map((item, idx) => (
              <span
                key={item.dt_txt}
                className="text-2xl"
                title={item.weather[0].description}
              >
                {item.main.temp < 15
                  ? "🧥"
                  : item.main.temp < 20
                  ? "🧢"
                  : item.main.temp < 27
                  ? "👕"
                  : "🌞"}
              </span>
            ))}
          </div>

          {/* Weather Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg mb-10 border border-blue-100 bg-white/90">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-100/80">
                  <th className="p-4 border-b text-blue-700 font-semibold">Date</th>
                  <th className="p-4 border-b text-blue-700 font-semibold">Temp (°C)</th>
                  <th className="p-4 border-b text-blue-700 font-semibold">Description</th>
                  <th className="p-4 border-b text-blue-700 font-semibold">Clothing Advice</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((item, idx) => (
                  <tr
                    key={item.dt_txt}
                    className={`transition ${idx % 2 === 0 ? "bg-blue-50/40" : "bg-pink-50/40"} hover:bg-yellow-50`}
                  >
                    <td className="p-4 font-medium">
                      {item.dt_txt.split(" ")[0]}
                    </td>
                    <td className="p-4 font-bold text-blue-600">
                      {item.main.temp.toFixed(1)}
                    </td>
                    <td className="p-4 capitalize">
                      {item.weather[0].description}
                    </td>
                    <td className="p-4 italic text-pink-700">
                      {getClothingAdvice(item.main.temp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weather Chart */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 text-center">
              📈 Temperature Trend
            </h2>
            <div className="bg-gradient-to-r from-blue-50 via-white to-pink-50 rounded-2xl p-6 shadow-lg">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dt_txt"
                    tickFormatter={(val) => val.split(" ")[0]}
                    tick={{ fontSize: 14, fill: "#2563eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 14, fill: "#2563eb" }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, background: "#fff" }}
                    formatter={(value: any, name: any) =>
                      name === "main.temp" ? [`${value}°C`, "Temp"] : [value, name]
                    }
                    labelFormatter={(label) => `Date: ${label.split(" ")[0]}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="main.temp"
                    stroke="#f472b6"
                    strokeWidth={4}
                    dot={{ r: 7, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 10, fill: "#f472b6", stroke: "#2563eb", strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
