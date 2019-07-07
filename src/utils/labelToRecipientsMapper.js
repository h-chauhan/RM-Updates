import Firestore from '@google-cloud/firestore';

const DB = new Firestore({
  projectId: 'dtu-rm-updates-241012',
  keyFilename: process.env.STAGE !== 'dev' && 'GOOGLE_CLOUD_CREDENTIALS.json',
});

const internshipSubscribers = DB.collection('subscribers').where('subscription_type', '==', 'internship');
const placementSubscribers = DB.collection('subscribers').where('subscription_type', '==', 'placement');

export default async function mapper(label) {
  const recipients = [];
  const snap = await (label === 'internship' ? internshipSubscribers.get() : placementSubscribers.get());
  snap.forEach((doc) => {
    recipients.push(doc.data().id);
  });
  return recipients;
}
