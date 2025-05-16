import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required.' });
    }

    try {
      // TODO: GET weather data from city name
        const weatherData = await WeatherService.getWeatherForCity(city);
      // TODO: save city to search history
        await HistoryService.addCity(city);
        const responseArray = [weatherData.currentWeather, ...weatherData.forecast];

        return res.status(200).json(responseArray);
    } catch (error) {
    console.error('Error in POST /:', error);
    return res.status(500).json({ error: 'Service error.' });
    }
  });

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('GET /history Error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedHistory = await HistoryService.removeCity(id);

    return res.status(200).json({
      message: `City with ID ${id} removed from history.`,
      history: updatedHistory
    });
  } catch (error) {
    console.error('Error in DELETE /history/:id:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
