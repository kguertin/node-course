import express, { Request, Response } from 'express';
import bodyparser from 'body-parser';
import cookieSession from 'cookie-session';

import { AppRouter } from './AppRouter';
import './controllers/LoginController';
import './controllers/RootController';

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['asecret'] }));

app.use(AppRouter.getInstance());

app.listen(3000, () => {
  console.log('listening on port 3000');
});
``;
