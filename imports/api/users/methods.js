import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Users } from './users.js';

export const update = new ValidatedMethod({
  name: 'users.update',

  validate: new SimpleSchema({
    id: { type: String },
    newText: { type: String }
  }).validator(),

  run({ id, newText }) {
    const message = Messages.findOne(id);

    if (!message.editableBy(this.userId)) {
      throw new Meteor.Error('Cannot edit message because it is not yours');
    }

    Messages.update(id, {
      $set: { text: newText }
    });
  }
});

const USERS_METHODS = _.pluck([
  update
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return USERS_METHODS.includes(name);
    },

    connectionId() { return true; },
  }, 5, 1e3);
}
