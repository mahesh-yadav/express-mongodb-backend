require('dotenv').config();
import express from 'express';
import path from 'path';
import { json } from 'body-parser';
import logger from 'morgan';
import cors from 'cors';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(json());

app.use('/', express.static(path.resolve(__dirname)));

export default app;
