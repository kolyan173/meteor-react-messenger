import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class MessagesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const user = Meteor.user();

    doc.authorLocation = user.profile.location;
    user.username && (doc.authorUsername = user.username);
    doc.createdAt || ( doc.createdAt = new Date() );

    return super.insert(doc, callback);
  }
}

export const Messages = new MessagesCollection('Messages');

Messages.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Messages.schema = new SimpleSchema({
  text: { type: String },
  createdAt: { type: Date },
  authorId: { type: String },
  authorLocation: { type: String },
  authorUsername: { type: String, optional: true }
});

Messages.attachSchema(Messages.schema);
