import express from 'express';
import dataBase from './dataBase';
import userRouter from './routs/userRouts';
import errorHandler from './middleware/errorHandler';
import articleRouter from './routs/articleRouts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

dataBase(process.env.DATA_BASE_URL);

app.use(express.json());

app.listen(3000, () => {
  console.log('Server started');
});

app.use(userRouter, articleRouter);

app.use(errorHandler);
