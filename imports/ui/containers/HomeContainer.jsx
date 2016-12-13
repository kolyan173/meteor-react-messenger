import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import { Messages } from '../../api/messages/messages.js';
import Home from '../pages/Home/Home.jsx';

export default createContainer(() => {
  const messages = Meteor.subscribe('messages');

  let selector;
  let options;

  if ( Meteor.user()) {
    selector = { authorLocation: Meteor.user() && Meteor.user().profile.location };
    options = {
      sort: { createdAt: 1 },
      limit: 20
    };
  }

  return {
    loading: !messages.ready(),
    messages: Messages.find(selector, options).fetch()
  };
}, Home);
