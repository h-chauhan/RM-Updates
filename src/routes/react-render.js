import { Router } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import templateHTML from '../templates/ssr';
import App from '../components/app';

const router = new Router();

router.get('/*', async (req, res) => {
  const reactDOM = renderToString(
    <StaticRouter location={req.url} context={{}}>
      <App />
    </StaticRouter>,
  );
  res.send(templateHTML(reactDOM));
});

export default router;
