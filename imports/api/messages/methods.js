import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Messages } from './messages.js';

export const insert = new ValidatedMethod({
  name: 'messages.insert',

  validate: new SimpleSchema({
    text: { type: String },
    authorId: { type: String },
    authorUsername: { type: String }
  }).validator(),

  run(data) {
    if (!this.userId) {
      throw new Meteor.Error('Must be logged in to insert message');
    }

    const message = Object.assign(data, { createdAt: new Date() });

    Messages.insert(message);
  }
});

export const updateText = new ValidatedMethod({
  name: 'messages.updateText',

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

export const remove = new ValidatedMethod({
  name: 'messages.remove',

  validate: new SimpleSchema({
    id: { type: String }
  }).validator(),

  run({ id }) {
    const message = Message.findOne(id);

    if (!message.editableBy(this.userId)) {
      throw new Meteor.Error('Cannot remove message because it is not yours');
    }

    Messages.remove(todoId);
  }
});

const MESSAGES_METHODS = _.pluck([
  insert,
  updateText,
  remove
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return MESSAGES_METHODS.includes(name);
    },

    connectionId() { return true; },
  }, 5, 1e3);
}
