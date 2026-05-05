export const OPENWEATHER_KEY = 'ed6f7a7f435cab95a91d943fe15f5b09';
export const NASA_KEY = '4347bf01341bc471a64048cf9c37289f';

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

export type InSightSol = {
  sol: string;
  AT?: { av: number; mn: number; mx: number }; // Atmospheric Temperature (°C)
  PRE?: { av: number; mn: number; mx: number }; // Pressure (Pa)
  HWS?: { av: number; mn: number; mx: number }; // Horizontal Wind Speed (m/s)
  WD?: { most_common?: { compass_point: string } };  // Wind direction
};

export type InSightData = {
  sols: InSightSol[];
  latestSol: InSightSol | null;
};

export type NasaImage = {
  title: string;
  description: string;
  url: string;
  date: string;
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

export async function fetchMarsWeather(): Promise<InSightData | null> {
  try {
    const url = `https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`InSight API error: ${res.status}`);
    const json = await res.json();

    const solKeys: string[] = json.sol_keys ?? [];
    if (!solKeys.length) return null;

    const sols: InSightSol[] = solKeys.map((sol) => ({
      sol,
      AT: json[sol]?.AT,
      PRE: json[sol]?.PRE,
      HWS: json[sol]?.HWS,
      WD: json[sol]?.WD,
    }));

    return {
      sols,
      latestSol: sols[sols.length - 1] ?? null,
    };
  } catch (e) {
    console.error('[fetchMarsWeather]', e);
    return null;
  }
}

const NASA_IMAGE_QUERIES = [
  'nebula', 'galaxy spiral', 'planet mars surface',
  'hubble deep field', 'saturn rings', 'solar flare',
];

export async function fetchNasaImage(): Promise<NasaImage | null> {
  try {
    const query = NASA_IMAGE_QUERIES[Math.floor(Math.random() * NASA_IMAGE_QUERIES.length)];
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=10`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA Images error: ${res.status}`);
    const json = await res.json();
    const items = json?.collection?.items ?? [];
    if (!items.length) return null;

    const item = items[Math.floor(Math.random() * items.length)];
    const data = item?.data?.[0];
    const links = item?.links ?? [];
    const imageUrl = links.find((l: any) => l.rel === 'preview')?.href ?? links[0]?.href;

    if (!imageUrl || !data) return null;

    return {
      title: data.title ?? 'NASA Space Image',
      description: data.description ?? '',
      url: imageUrl,
      date: data.date_created?.slice(0, 10) ?? '',
    };
  } catch (e) {
    console.error('[fetchNasaImage]', e);
    return null;
  }
}

export function weatherIconToEmoji(iconCode: string): string {
  if (!iconCode) return '🌡';
  const code = iconCode.replace('d', '').replace('n', '');
  const map: Record<string, string> = {
    '01': '☀️', '02': '🌤', '03': '☁️', '04': '☁️',
    '09': '🌧', '10': '🌦', '11': '⛈', '13': '❄️', '50': '🌫',
  };
  return map[code] ?? '🌡';
}

export function formatForecastDate(dtTxt: string): string {
  const d = new Date(dtTxt);
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export function pickDailyForecasts(list: ForecastEntry[]): ForecastEntry[] {
  const seen = new Set<string>();
  return list.filter((entry) => {
    const day = entry.dt_txt.slice(0, 10);
    if (seen.has(day)) return false;
    seen.add(day);
    return true;
  }).slice(0, 5);
}