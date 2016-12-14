import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class UsersCollection extends Mongo.Collection {
  update(selector, modifier) {
    return Meteor.users.update({_id: Meteor.userId()}, modifier);
  }
}

export const Users = new UsersCollection('Users');

Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Users.schema = {};

Users.schema.UserProfile = new SimpleSchema({
  location: { type: String },
  oldLocations: { type: [String] }
});

Users.schema.User = new SimpleSchema({
  _id: { type: String },
  username: { type: String },
  emails: { type: [Object] },
  createdAt: { type: Date },
  profile: { type: Users.schema.UserProfile }
});

Users.attachSchema(Users.schema.User);
