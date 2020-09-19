import _ from 'lodash';
import {
  getSenderName, sendMessageWithButtons, sendMessage,
} from './messenger';
import MessageTemplates from '../utils/message-templates';
import { getSubscriber, saveSubscriber, updateSubscriber } from '../utils/database';
import logger from '../logger';

export default async function controller(event) {
  const senderId = event.sender.id;
  const { name: senderName } = await getSenderName(senderId);
  const subscriber = await getSubscriber(senderId, senderName);

  if (!subscriber) {
    // The user has messaged for the first time.
    await saveSubscriber(senderId, senderName);
    logger.log(`SUBSCRIBER ${senderId} ADDED TO DB`);
    await sendMessageWithButtons(senderId, MessageTemplates.WELCOME_MESSAGE);
    await sendMessageWithButtons(senderId, MessageTemplates.ASK_SUBSCRIBE);
  } else if (!subscriber.type) {
    // The user has not subscribed.
    const payload = _.get(event, 'postback.payload');
    const textMessage = _.get(event, 'message.text');
    if (payload === 'SUBSCRIBE_INTERNSHIP' || payload === 'SUBSCRIBE_PLACEMENT') {
      updateSubscriber(
        senderId, senderName,
        payload === 'SUBSCRIBE_INTERNSHIP' ? 'internship' : 'placement'
      )
      sendMessage(senderId, MessageTemplates.SAVE_SUBSCRIPTION);
    } else if (textMessage.toLowerCase() === 'placement' || textMessage.toLowerCase() === 'internship') {
      // Save the subscription.
      updateSubscriber(senderId, senderName, textMessage.toLowerCase());
      sendMessage(senderId, MessageTemplates.SAVE_SUBSCRIPTION);
    } else {
      // Ask again to subscribe.
      sendMessageWithButtons(senderId, MessageTemplates.ASK_SUBSCRIBE);
    }
  } else {
    // General message.
    logger.log(`SUBSCRIBER ${senderId} ALREADY EXISTS`);
    sendMessage(senderId, MessageTemplates.GENERAL_MESSAGE);
  }
}
