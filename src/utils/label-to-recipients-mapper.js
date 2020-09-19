import { getSubscribersByType } from "./database";

export default async function mapper(label) {
  const recipients = [];
  const subscribers = await getSubscribersByType(label);
  subscribers.forEach((doc) => {
    recipients.push(doc.senderId);
  });
  return recipients;
}
