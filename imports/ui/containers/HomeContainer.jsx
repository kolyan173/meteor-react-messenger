import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import { Messages } from '../../api/messages/messages.js';
import Home from '../pages/Home/Home.jsx';

export default createContainer(() => {
  const messages = Meteor.subscribe('messages');

  return {
    loading: !messages.ready(),
    messages: Messages.find({}).fetch()
  };
}, Home);
