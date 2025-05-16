import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(
    city: string,
    date: string,
    description: string,
    temperature: number,
    humidity: number,
    windSpeed: number
  ) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.API_KEY;

  private buildGeocodeQuery(city: string): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery({ lat, lon}: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${lat}&long=${lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any ): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(city);
    const response = await fetch(url);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Geocoding API error ${response.status}: ${errText}`);
      throw new Error(`Failed to fetch location for city: ${city}`);
    }

    const data = await response.json() as { lat: number; lon: number}[];
    console.log('Geocoding response:', data);

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error (`No location data found for city: ${city}`);
    }

    return this.destructureLocationData(data[0]);
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coords: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coords);
    const response = await fetch(url);
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(data: any): Weather {
    const city = data.city.name;
    const current = data.list[0];
    const date = new Date(current.dt * 1000).toLocaleDateString();
    const description = current.weather[0].description;
    const temperature = current.main.temperature;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.windSpeed;

    return new Weather(city, date, description, temperature, humidity, windSpeed);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, entries: any[]): Weather[] {
    return entries
      .filter((_entry, i) => i % 8 === 0)
      .slice(1, 6)
      .map(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        return new Weather(
          currentWeather.city,
          date,
          entry.weather[0].description,
          entry.main.temp,
          entry.main.humidity,
          entry.windSpeed
        );
      });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coords = await this.fetchAndDestructureLocationData(city);
    const rawData = await this.fetchWeatherData(coords);
    const currentWeather = this.parseCurrentWeather(rawData);
    const forecast = this.buildForecastArray(currentWeather, rawData.list);

    return {
      currentWeather,
      forecast
    };
  }
}

export default new WeatherService();
