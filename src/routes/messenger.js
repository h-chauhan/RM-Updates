import { Router } from 'express';
import {
  getSenderName, sendMessage, sendMessageWithUrlButtons, sendMessageWithQuickReplies,
} from '../controllers/messenger';

const router = Router();

/* GET users listing. */
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
      recipients, textMessage, urlButtons, quickReplies,
    } = req.body;
    recipients.forEach(async (recipient) => {
      if (urlButtons) {
        res.send(await sendMessageWithUrlButtons(recipient, textMessage, urlButtons));
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
