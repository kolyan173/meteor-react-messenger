import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Accounts } from 'meteor/accounts-base';

import { Users } from './users.js';

export const update = new ValidatedMethod({
  name: 'users.update',

  validate: new SimpleSchema({
    username: { type: String, optional: true },
    email: { type: String, optional: true },
    profile: { type: Users.schema.UserProfile }
  }).validator(),

  run(data) {
    console.log('DATA', data);
    const user = Meteor.users.findOne(id);

    if (!user.editableBy(this.userId)) {
      throw new Meteor.Error('Cannot edit user because it is not yours');
    }

    if (data.username) {
        user.username = data.username;
    }

    if (data.email) {
        user.emails[0].address = data.email;

        Accounts.sendVerificationEmail(user._id);
    }

    Object.assign(user.profile, _.omit(
        data,
        ['username', 'emails', 'password_confirm', 'current_password']
    ));
    Meteor.users.update({_id: Meteor.userId()}, user);
    // Messages.update(id, {
    //   $set: { text: newText }
    // });
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
