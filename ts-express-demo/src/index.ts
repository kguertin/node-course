import express, { Request, Response } from 'express';
import bodyparser from 'body-parser';
import cookieSession from 'cookie-session';

import { router } from './routes/loginRoutes';
import { AppRouter } from './AppRouter';
import './controllers/LoginController';

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['asecret'] }));

app.use(router);
app.use(AppRouter.getInstance());

app.listen(3000, () => {
  console.log('listening on port 3000');
});
``;
