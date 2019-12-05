require('dotenv').config();
import express from 'express';
import path from 'path';
import { json } from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import userRouter from './routes/users';
import authRouter from './routes/auth';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(json());

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use('/', express.static(path.resolve(__dirname)));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      errors: {
        msg: err.message,
      },
    });
  }
});

export default app;
