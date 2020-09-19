import { Router } from 'express';
import {
  getSenderName,
  sendMessage,
  sendMessageWithButtons,
  sendMessageWithQuickReplies,
} from '../controllers/messenger';
import labelToRecipientsMapper from '../utils/label-to-recipients-mapper';
import logger from '../logger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    logger.log('Request: ', JSON.stringify(req.query));
    const userId = req.query.uid;
    const response = await getSenderName(userId);
    logger.log('Response: ', JSON.stringify(response));
    res.send(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Request: ', JSON.stringify(req.body));
    const {
      label, textMessage, buttons, quickReplies,
    } = req.body;
    let { recipients } = req.body;
    if (label) {
      recipients = await labelToRecipientsMapper(label);
    }
    if (recipients && recipients.length) {
      const response = [];
      recipients.forEach(async (recipient) => {
        if (buttons) {
          response.push(await sendMessageWithButtons(recipient, { textMessage, buttons }));
        } else if (quickReplies) {
          response.push(await sendMessageWithQuickReplies(recipient, { textMessage, quickReplies }));
        } else {
          response.push(await sendMessage(recipient, { textMessage }));
        }
        res.send({ response })
        logger.log('MESSAGE SENT SUCCESSFULLY');
      });
    } else {
      res.status(400).send({ error: 'no recipients found.' });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

export default router;
