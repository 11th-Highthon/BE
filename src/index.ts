import express from 'express';
import dotenv from 'dotenv';
import './config/database';
import storyRouter from './routes/storyRouter';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/stories', storyRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});