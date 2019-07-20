import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import messengerRouter from './routes/messenger';
import webhookRouter from './routes/webhook';
import paymentsRouter from './routes/payments';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/messenger', messengerRouter);
app.use('/webhook', webhookRouter);
app.use('/pay', paymentsRouter);

export default app;
