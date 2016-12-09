import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class MessagesCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.createdAt || ( doc.createdAt = new Date() );

    return super.insert(doc, callback);
  }
}

export const Messages = new MessagesCollection('Messages');

// Messages.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; }
// });

Messages.schema = new SimpleSchema({
  // id: {
  //   type: String,
  //   regEx: SimpleSchema.RegEx.Id
  // },
  text: {
    type: String
  },
  createdAt: {
    type: Date
  },
  authorId: {
    type: String
  },
  authorName: {
    type: String
  }
});

Messages.attachSchema(Messages.schema);
