import { Router } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Axios from 'axios';

import templateHTML from '../templates/ssr';
import App from '../components/app';
import { verifychecksum } from '../utils/paytm/checksum';
import paytmConfigs from '../configs/paytm';

const router = new Router();

router.post('/', async (req, res) => {
  let paytmChecksum;
  const paytmParams = {};
  Object.keys(req.body).forEach((key) => {
    if (key === 'CHECKSUMHASH') {
      paytmChecksum = req.body[key];
    } else {
      paytmParams[key] = req.body[key];
    }
  });
  // Verify checksum
  if (verifychecksum(paytmParams, paytmConfigs.KEY, paytmChecksum)) {
    const response = await Axios.post(`${paytmConfigs.BASE_URL}/status`, {
      MID: paytmParams.MID,
      ORDERID: paytmParams.ORDERID,
      CHECKSUMHASH: paytmChecksum,
    });
    res.status(200).send(response);
  } else {
    res.status(400).send({
      TXN_STATUS: 'FAILURE',
    });
  }
});

export default router;
