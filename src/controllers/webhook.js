import Firestore from '@google-cloud/firestore';
import _ from 'lodash';
import {
  getSenderName, sendMessageWithButtons, sendMessage,
} from './messenger';

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
    await subscriberRef.set({
      id: senderId,
      name: senderName,
    });
    console.log(`SUBSCRIBER ${senderId} ADDED TO DB`);
    await sendMessageWithButtons(
      senderId,
      'Welcome to DTU RM Updates. You can read the Privacy Policy here: dturmupdates.me/PrivacyPolicy.html',
      [{
        type: 'web_url',
        title: 'Privacy Policy',
        url: 'dturmupdates.me/PrivacyPolicy.html',
      }],
    );
    sendMessageWithButtons(
      senderId,
      'For which Resume Manager, do you want to subscribe?\n\nInternship or Placement?',
      [{
        type: 'postback',
        title: 'Internship',
        payload: 'SUBSCRIBE_INTERNSHIP',
      }, {
        type: 'postback',
        title: 'Placement',
        payload: 'SUBSCRIBE_PLACEMENT',
      }],
    );
  } else if (!subscriber.data().subscription_type) {
    const payload = _.get(event, 'postback.payload');
    if (payload === 'SUBSCRIBE_INTERNSHIP' || payload === 'SUBSCRIBE_PLACEMENT') {
      subscriberRef.set({
        subscription_type: payload === 'SUBSCRIBE_INTERNSHIP' ? 'internship' : 'placement',
      }, { merge: true });
      sendMessage(senderId, 'Thank you! You have been successfully subscribed. Stay tuned for updates.');
    } else {
      sendMessageWithButtons(
        senderId,
        'For which Resume Manager, do you want to subscribe?\n\nInternship or Placement?',
        [{
          type: 'postback',
          title: 'Internship',
          payload: 'SUBSCRIBE_INTERNSHIP',
        }, {
          type: 'postback',
          title: 'Placement',
          payload: 'SUBSCRIBE_PLACEMENT',
        }],
      );
    }
  } else {
    console.log(`SUBSCRIBER ${senderId} ALREADY EXISTS`);
    sendMessage(senderId, 'Hey! Stay tuned for updates. If you have any query, we will connect you with someone real soon.');
  }
}
