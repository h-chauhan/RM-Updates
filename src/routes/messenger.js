import { Router } from 'express';
import {
  getSenderName, sendMessage, sendMessageWithButtons, sendMessageWithQuickReplies,
} from '../controllers/messenger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    console.log('Request: ', JSON.stringify(req.query));
    const userId = req.query.uid;
    const response = await getSenderName(userId);
    console.log('Response: ', JSON.stringify(response));
    res.send(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Request: ', JSON.stringify(req.body));
    const {
      recipients, textMessage, buttons, quickReplies,
    } = req.body;
    recipients.forEach(async (recipient) => {
      if (buttons) {
        res.send(await sendMessageWithButtons(recipient, textMessage, buttons));
      } else if (quickReplies) {
        res.send(await sendMessageWithQuickReplies(recipient, textMessage, quickReplies));
      } else {
        res.send(await sendMessage(recipient, textMessage));
      }
      console.log('MESSAGE SENT SUCCESSFULLY');
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
