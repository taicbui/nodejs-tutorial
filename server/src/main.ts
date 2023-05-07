// import required packages and modules
import express, { Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { connectToDatabase } from './database';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../swagger';

const main = async () => {
  // load the environment variables. This needs to be on the top for everything else under which needs .env to work
  dotenv.config();

  // Connect to the database
  await connectToDatabase();

  // express instance
  const app = express();

  // use cors middleware to enable Cross-Origin Resource Sharing
  app.use(cors());

  // use bodyParser middleare to parse incoming json and urlencoded payload
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // use Swagger UI Express middleware to serve the API docs
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpecs));

  // use routes
  app.use('/api', routes);

  // Centralized error handling middleware for all errors pass to next()
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    // Log the error, for example, to a logging service or console
    console.error(error);

    // Set the status code and error message
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An internal server error occurred';

    // Send the error response
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  });

  // configure the port number and start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main().catch((error) => console.log('ERROR STARTING SERVER: ', error));
