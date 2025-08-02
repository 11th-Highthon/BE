import express from 'express';
import "dotenv/config";
import swaggerUi from 'swagger-ui-express';
import './config/database';
import storyRouter from './routes/storyRouter';
import userRouter from './routes/userRouter';
import specs from './config/swagger';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/stories', storyRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger docs available at http://localhost:${process.env.PORT || 3000}/api-docs`);
});