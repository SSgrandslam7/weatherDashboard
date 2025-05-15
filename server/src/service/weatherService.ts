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
  private cityName: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = `http://api.openweather.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0];
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any ): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery({ lat, lon }: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const city = response.city.name;
    const current = response.list[0];
    const date = new Date(current.dt * 1000).toLocaleDateString();
    const description = current.weather[0].description;
    const temperature = current.main.temperature;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.windSpeed;

    return new Weather(city, date, description, temperature, humidity, windSpeed);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast = weatherData
      .filter((_entry: any, index: number) => index % 8 === 0)
      .slice(1, 6)
      .map((entry: any) => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        const description = entry.weather[0].description;
        const temperature = entry.main.temp;
        const humidity = entry.main.humidity;
        const windSpeed = entry.wind.windSpeed;

        return new Weather(
          currentWeather.city,
          date,
          description,
          temperature,
          humidity,
          windSpeed
        );
      });
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;

    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list);

    return {
      current: currentWeather,
      forecast
    };
  }
}

export default new WeatherService();
