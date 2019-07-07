export default Object.freeze({
  WELCOME_MESSAGE: {
    textMessage: 'Welcome to DTU RM Updates. You can read the Privacy Policy here: dturmupdates.me/PrivacyPolicy.html',
    buttons: [{
      type: 'web_url',
      title: 'Privacy Policy',
      url: 'dturmupdates.me/PrivacyPolicy.html',
    }],
  },
  ASK_SUBSCRIBE: {
    textMessage: 'Let\'s get started! For which Resume Manager, do you want to subscribe?\n\nInternship or Placement?',
    buttons: [{
      type: 'postback',
      title: 'Internship',
      payload: 'SUBSCRIBE_INTERNSHIP',
    }, {
      type: 'postback',
      title: 'Placement',
      payload: 'SUBSCRIBE_PLACEMENT',
    }],
  },
  SAVE_SUBSCRIPTION: {
    textMessage: 'Thank you! You have been successfully subscribed. Stay tuned for updates.',
  },
  GENERAL_MESSAGE: {
    textMessage: 'Hey! Stay tuned for updates. If you have any query, we will connect you with a human real soon.',
  },
});
