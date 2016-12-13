import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class UsersCollection extends Mongo.Collection {
  // insert(doc, callback) {
  //   console.log('USRES: insert');
  //   doc.createdAt || ( doc.createdAt = new Date() );
  //
  //   return super.insert(doc, callback);
  // }
}

export const Users = new UsersCollection('Users');

Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Users.schema = {};

Users.schema.UserProfile = new SimpleSchema({
  location: { type: String }
});

Users.schema.User = new SimpleSchema({
  username: { type: String, optional: true },
  emails: { type: [Object], optional: true },
  createdAt: { type: Date },
  profile: { type: Users.schema.UserProfile }
});

Users.attachSchema(Users.schema.User);
