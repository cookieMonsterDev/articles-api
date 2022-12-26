import express from 'express';
import dataBase from './dataBase';
import config from './config';
import userRouter from './routs/userRouts';
import errorHandler from './middleware/errorHandler';
import articleRouter from './routs/articleRouts';

const app = express();

dataBase(config.dataBaseURL);

app.use(express.json());

app.listen(3000, () => {
  console.log('Server started');
});

app.use(userRouter, articleRouter);

app.use(errorHandler);
