import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.handler.js';
import routerAnime from './routes/animes.js';

const app = express();
dotenv.config();
const PORT = process.env.DB_PORT

app.use(express.json());
app.use('/animes', routerAnime);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})


