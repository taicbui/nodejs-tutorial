import { createConnection } from 'typeorm';
import { User } from './entities/User';

export const connectToDatabase = async () => {
  // configure database connection
  await createConnection({
    type: 'postgres', // or any other database type you are using
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    entities: [User],
    synchronize: true, // set to false in production
    logging: false,
  });

  // log message to confirm the connection
  console.log('Database connected successfully.');
};
