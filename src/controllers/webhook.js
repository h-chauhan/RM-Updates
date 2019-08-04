import Firestore from '@google-cloud/firestore';
import _ from 'lodash';
import {
  getSenderName, sendMessageWithButtons, sendMessage,
} from './messenger';
import MessageTemplates from '../utils/message-templates';

const DB = new Firestore({
  projectId: 'dtu-rm-updates-241012',
  keyFilename: process.env.STAGE !== 'dev' && 'GOOGLE_CLOUD_CREDENTIALS.json',
});

export default async function controller(event) {
  const senderId = event.sender.id;
  const { name: senderName } = await getSenderName(senderId);
  const subscriberRef = DB.collection('subscribers').doc(`${senderId}:${senderName}`);
  const subscriber = await subscriberRef.get();

  if (!subscriber.exists) {
    // The user has messaged for the first time.
    await subscriberRef.set({ id: senderId, name: senderName });
    console.log(`SUBSCRIBER ${senderId} ADDED TO DB`);
    await sendMessageWithButtons(senderId, MessageTemplates.WELCOME_MESSAGE);
    await sendMessageWithButtons(senderId, MessageTemplates.ASK_SUBSCRIBE);
  } else if (!subscriber.data().subscription_type) {
    // The user has not subscribed.
    const payload = _.get(event, 'postback.payload');
    const textMessage = _.get(event, 'message.text');
    if (payload === 'SUBSCRIBE_INTERNSHIP' || payload === 'SUBSCRIBE_PLACEMENT') {
      // Save the subscription.
      subscriberRef.set({
        subscription_type: payload === 'SUBSCRIBE_INTERNSHIP' ? 'internship' : 'placement',
      }, { merge: true });
      sendMessage(senderId, MessageTemplates.SAVE_SUBSCRIPTION);
    } else if (textMessage.toLowerCase() === 'placement' || textMessage.toLowerCase() === 'internship') {
      // Save the subscription.
      subscriberRef.set({
        subscription_type: textMessage.toLowerCase(),
      }, { merge: true });
      sendMessage(senderId, MessageTemplates.SAVE_SUBSCRIPTION);
    } else {
      // Ask again to subscribe.
      sendMessageWithButtons(senderId, MessageTemplates.ASK_SUBSCRIBE);
    }
  } else {
    // General message.
    console.log(`SUBSCRIBER ${senderId} ALREADY EXISTS`);
    sendMessage(senderId, MessageTemplates.GENERAL_MESSAGE);
  }
}
