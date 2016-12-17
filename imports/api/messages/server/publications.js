import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages.js';

Meteor.smartPublish('messages', (locationDataList) => {
  return locationDataList.map((data) => {
    const { location, start, finish, limit } = data;
    const selector = { authorLocation: location };
    const query = {
      sort: { createdAt: -1 }
    };

    if (start) {
      selector.createdAt = { $gte: start };
    }

    if (finish) {
      selector.createdAt['$lte'] = finish;
    }

    if (limit) {
      query.limit = limit;
    }

    return  Messages.find(selector, query);
  });
});
