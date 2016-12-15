import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';
import { Messages } from '../messages.js';

Meteor.smartPublish('messages', (locationDataList) => {
  console.log('publish');
// Meteor.publish('messages', (locationDataList) => {
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
    console.log(data, cursor.count());
    return cursor;
  });
});

// Meteor.publish('oldMessages', (oldLocationData, limit, isStop) => {
//   if (isStop) { return this.stop(); }
//
//   const { location, start, finish } = oldLocationData;
//
//   return Messages.find({
//     authorLocation: location,
//     createdAt: { $gt: start, $lt: finish }
//   }, {
//     limit,
//     sort: { createdAt: 1 }
//   });
// });
