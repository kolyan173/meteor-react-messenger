import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';
// import { Counts } from 'meteor/tmeasday:publish-counts';

import { Messages } from '../../api/messages/messages.js';
import Home from '../pages/Home/Home.jsx';

export default createContainer(() => {
  let messages;
  let oldMessages;
  const user = Meteor.user();
  const limitCount = 20;

  if ( user ) {
    let { location } = user.profile;
    messages = Meteor.subscribe('messages', location);
  }

  if (messages && messages.ready()) {
    recursiveLoadData(user.profile.oldLocations);
  }

  function recursiveLoadData(oldLocations) {
    let { location } = user.profile;
    const messagesCount = Messages.find({ authorLocation: location }).count();

    if (messagesCount < limitCount) {
      const lastLocation = _.last(oldLocations);

      if (lastLocation) {
        const oldLocationData = Object.assign(lastLocation, {
          start: _.last(lastLocation) ? _.last(lastLocation).finish : 0
        });

        oldMessages = Meteor.subscribe('oldMessages', oldLocationData, limitCount - messagesCount);

        if (!oldMessages.ready()) {
          recursiveLoadData(_.initial(oldLocations));
        }
      }
    }
  }

  if (oldMessages && oldMessages.ready()) {
    // Meteor.subscribe('oldMessages', null, null, true);
  }

  return {
    loading: !(messages && messages.ready()),
    messages: Messages.find({}, {sort: { createdAt: 1 }}).fetch()
  };
}, Home);
