import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';

import { loggerMiddleware } from './logger';
import messengerRouter from './routes/messenger';
import webhookRouter from './routes/webhook';
import paymentsRouter from './routes/payments';
// import reactRouter from './routes/react-render';

const app = express();

app.use(loggerMiddleware);
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/messenger', messengerRouter);
app.use('/webhook', webhookRouter);
app.use('/verify-payment', paymentsRouter);
// app.use('/*', reactRouter);

export default app;
