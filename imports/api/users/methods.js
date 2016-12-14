import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Users } from './users.js';

export const update = new ValidatedMethod({
  name: 'users.update',

  validate: new SimpleSchema({
    username: { type: String, optional: true },
    email: { type: String, optional: true },
    location: { type: String, optional: true },
    password: { type: String, optional: true },
    confirm: { type: String, optional: true },
    newpassword: { type: String, optional: true }
  }).validator(),

  run(data) {
    const user = Meteor.users.findOne(this.userId);
    const { username, email, location } = data;

    if (username) {
      user.username = username;
    }

    if (email) {
      user.emails[0].address = email;

      Accounts.sendVerificationEmail(user._id);
    }

    if (location) {
      user.profile.oldLocations || (user.profile.oldLocations = []);

      let { oldLocations } = user.profile;

      oldLocations.push({
        location: user.profile.location,
        finish: Date.now(),
      });

      user.profile.location = location;
    }

    Users.update(this.userId, user);
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
