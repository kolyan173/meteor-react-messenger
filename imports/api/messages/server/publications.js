import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages.js';

Meteor.smartPublish('messages', (locationDataList) => {
  return locationDataList.map((data) => {
    const { location, start, finish, limit } = data;
    const selector = { authorLocation: location };

    if (start) {
      selector.createdAt = { $gt: start, $lt: finish };
    }

    const cursor = Messages.find(selector, {
      limit,
      sort: { createdAt: -1 }
    });

    return cursor;
  });
});
