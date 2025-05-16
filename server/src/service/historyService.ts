import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyPath = path.join(__dirname, '../../db/searchHistory.json');

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string, id?: string){
    this.name = name;
    this.id = id ?? uuidv4();
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyPath, 'utf8');
      return data ? JSON.parse(data): [];
    } catch (error) {
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(historyPath, JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City[]> {
    const cities = await this.read();

    if (cities.some( c => c.name.toLowerCase()=== cityName.toLowerCase())){
      return cities;
  }

  const newCity = new City(cityName);
  cities.push(newCity);
  await this.write(cities);
  return cities;
}

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<City[]> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
    return cities;
  }
}

export default new HistoryService();
