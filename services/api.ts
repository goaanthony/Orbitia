export const OPENWEATHER_KEY = 'ed6f7a7f435cab95a91d943fe15f5b09';
export const NASA_KEY = 'DEMO_KEY';
export type ForecastEntry = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
};

export type WeatherForecast = {
  city: { name: string; country: string };
  list: ForecastEntry[];
};

export type ApodData = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
};

export async function fetchWeatherForecast(
  city: string,
  countryCode = ''
): Promise<WeatherForecast | null> {
  try {
    const q = countryCode ? `${city},${countryCode}` : city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&appid=${OPENWEATHER_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('[fetchWeatherForecast]', e);
    return null;
  }
}

export async function fetchCurrentWeather(city: string, countryCode = '') {
  try {
    const q = countryCode ? `${city},${countryCode}` : city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${OPENWEATHER_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('[fetchCurrentWeather]', e);
    return null;
  }
}

const NASA_IMAGE_QUERIES = ['nebula', 'galaxy', 'planet', 'mars rover', 'hubble'];

export async function fetchNasaImage(): Promise<ApodData | null> {
  const query = NASA_IMAGE_QUERIES[Math.floor(Math.random() * NASA_IMAGE_QUERIES.length)];
  try {
    const url = `https://images-api.nasa.gov/search?q=${query}&media_type=image&year_start=2020&page_size=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA Image Library error: ${res.status}`);
    const json = await res.json();
    const items: any[] = json?.collection?.items ?? [];
    // Pick a random item from results for variety
    const item = items[Math.floor(Math.random() * items.length)];
    if (!item) throw new Error('No items returned');
    return {
      title: item.data?.[0]?.title ?? 'NASA Image',
      date: item.data?.[0]?.date_created?.slice(0, 10) ?? '',
      explanation: item.data?.[0]?.description ?? '',
      url: item.links?.[0]?.href ?? '',
      media_type: 'image',
    };
  } catch (e) {
    console.error('[fetchNasaImage]', e);
    return null;
  }
}

export function weatherIconToEmoji(icon: string): string {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '💨', '50n': '💨',
  };
  return map[icon] ?? '🌡';
}

export function formatForecastDate(dt_txt: string): { day: string; date: string } {
  const d = new Date(dt_txt);
  const day = d.toLocaleDateString('en-US', { weekday: 'long' });
  const date = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  return { day, date };
}

export function pickDailyForecasts(list: ForecastEntry[], days = 5): ForecastEntry[] {
  const seen = new Set<string>();
  const result: ForecastEntry[] = [];
  for (const entry of list) {
    const day = entry.dt_txt.slice(0, 10);
    const isNoon = entry.dt_txt.includes('12:00:00');
    if (!seen.has(day) || isNoon) {
      if (seen.has(day)) {
        const idx = result.findIndex(e => e.dt_txt.startsWith(day));
        if (idx !== -1) result[idx] = entry;
      } else {
        seen.add(day);
        result.push(entry);
      }
    }
    if (result.length >= days && seen.size >= days) break;
  }
  return result.slice(0, days);
}