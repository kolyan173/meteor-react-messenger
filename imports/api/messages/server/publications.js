import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';
import { Messages } from '../messages.js';

const messageLimit = 20;
const query = {
  sort: { createdAt: -1 },
  limit: messageLimit
};

Meteor.publish('messages', (location) => {
  console.log(_.last(Messages.find({ authorLocation: location }, query).fetch()));
  return Messages.find({ authorLocation: location }, query);
});

Meteor.publish('oldMessages', (oldLocationData, limit, isStop) => {
  if (isStop) { return this.stop(); }

  const { location, start, finish } = oldLocationData;

  return Messages.find({
    authorLocation: location,
    createdAt: { $gt: start, $lt: finish }
  }, {
    limit,
    sort: { createdAt: 1 }
  });
});
