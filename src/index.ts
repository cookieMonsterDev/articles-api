import express from 'express';
import dataBase from './dataBase';
import userRouter from './routs/userRouts';
import errorHandler from './middleware/errorHandler';
import articleRouter from './routs/articleRouts';
import dotenv from 'dotenv';
import commentsRouter from './routs/commentsRouts';
import cors from 'cors';

dotenv.config();

const allowedOrigins = [process.env.CORS_URL];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

const app = express();

dataBase(process.env.DATA_BASE_URL);

app.use(express.json());

app.use(cors(options));

app.listen(3000, () => {
  console.log('Server started');
});

app.use(userRouter, articleRouter, commentsRouter);

app.use(errorHandler);
