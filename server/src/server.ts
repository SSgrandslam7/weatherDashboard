import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import weatherRoutes from './routes/api/weatherRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);

// TODO: Serve static files of entire client dist folder
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '../client/dist')));

app.get('*', (_req, res) => {
    res.sendFile(path.join(_dirname, '../client/dist/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
