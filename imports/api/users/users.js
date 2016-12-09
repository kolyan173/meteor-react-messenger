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

Users.schema = new SimpleSchema({
  email: {
    type: String
  },
  createdAt: {
    type: Date
  },
  username: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  }
});

Users.attachSchema(Users.schema);

Users.helpers({
  fullName() {
    return this.username + ' ' + this.lastName;
  }
})
