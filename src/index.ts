import express from 'express';
import dataBase from './dataBase';
import config from './config';
import authRouter from './routs/authRouts';
import errorHandler from './core/middleware/errorHandler/errorHandler';

const app = express();

dataBase(config.dataBaseURL);

app.use(express.json());

app.listen(3000, () => {
  console.log('Server started');
});

app.use(authRouter);

app.use(errorHandler);
