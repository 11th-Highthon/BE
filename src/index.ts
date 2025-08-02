import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import './config/database';
import storyRouter from './routes/storyRouter';

dotenv.config();

const app = express();

app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Story API',
      version: '1.0.0',
      description: 'API documentation for the Story service',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/schemas/*.ts'], // files containing annotations as above
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/stories', storyRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger docs available at http://localhost:${process.env.PORT || 3000}/api-docs`);
});