import Firestore from '@google-cloud/firestore';
import {
  getSenderName, sendMessageWithUrlButtons, sendMessageWithQuickReplies,
} from './messenger';

const DB = new Firestore({
  projectId: 'dtu-rm-updates-241012',
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
    sendMessageWithUrlButtons(
      senderId,
      'Welcome to DTU RM Updates. You can read the Privacy Policy here: dturmupdates.me/PrivacyPolicy.html',
      [{
        title: 'Privacy Policy',
        url: 'dturmupdates.me/PrivacyPolicy.html',
      }],
    );
    sendMessageWithQuickReplies(
      senderId,
      'For which Resume Manager, do you want to subscribe?\n\nInternship or Placement',
      ['Internship', 'Placement'],
    );
  } else if (!subscriber.data().subscription_type) {
    sendMessageWithQuickReplies(
      senderId,
      'For which Resume Manager, do you want to subscribe?\n\nInternship or Placement',
      ['Internship', 'Placement'],
    );
  } else {
    console.log(`SUBSCRIBER ${senderId} ALREADY EXISTS`);
  }
}
