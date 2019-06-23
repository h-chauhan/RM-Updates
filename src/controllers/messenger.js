import Axios from 'axios';

const PAGE_ACCESS_TOKEN = 'EAAEXHEZCeTGwBACuLZCEwpJwZBtuPTgADhYV5PqRPKd6dufyRShUTRojiQjbroEbNezi6NE8fQ5fXvxt7mHdZBMtwipwjd15TlmHoUVd83ZBzolemdeyeVwczTQN4XR4nYb2t9WBY7GaIVt4sZCgXDVdGHNtlTOKNxEV3vCrgwcQZDZD';
const GRAPH_API = userId => `https://graph.facebook.com/${userId}?fields=name&access_token=${PAGE_ACCESS_TOKEN}`;
const MESSENGER_API = `https://graph.facebook.com/v3.3/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

export const getSenderName = async (userId) => {
  const response = await Axios.get(GRAPH_API(userId));
  return response.data;
};

export const sendMessage = async (recpId, textMessage) => (await Axios.post(MESSENGER_API, {
  recipient: { id: recpId },
  message: {
    text: textMessage,
  },
})).data;

export const sendMessageWithUrlButtons = async (recpId, textMessage, buttons) => {
  const { data } = await Axios.post(MESSENGER_API, {
    recipient: { id: recpId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: textMessage,
          buttons: buttons.map(({ url, title }) => ({
            type: 'web_url',
            url,
            title,
          })),
        },
      },
    },
  });
  return data;
};

export const sendMessageWithQuickReplies = (recpId, textMessage, quickReplies) => {
  Axios.post(MESSENGER_API, {
    recipient: { id: recpId },
    message: {
      text: textMessage,
      quick_replies: quickReplies.map(replyText => ({
        content_type: 'text',
        title: replyText,
        payload: replyText,
      })),
    },
  });
};
