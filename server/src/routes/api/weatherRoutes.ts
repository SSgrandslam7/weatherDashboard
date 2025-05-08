import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService';
// import WeatherService from '../../service/weatherService';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required.' });
    }
  // TODO: GET weather data from city name
  //const weatherData = await WeatherService.getWeatherByCity(city);

  // TODO: save city to search history
    const updateHistory = await HistoryService.addCity(city);
    res.json({
    message: `${city} added to history.`,
    history: updateHistory,
    // weather: weatherData
    });
  } catch (error) {
    console.error('Error in POST /:', error);
    res.status(500).json({ error: 'Service erro.' });
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error in GET /history:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedHistory = await HistoryService.removeCity(id);

    res.json({
      message: `City with ID ${id} removed from history.`,
      history: updatedHistory
    });
  } catch (error) {
    console.error('Error in DELETE /history/:id:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
