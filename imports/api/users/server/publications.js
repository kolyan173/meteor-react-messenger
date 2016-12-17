import { Meteor } from 'meteor/meteor';

Meteor.publish('me', function() {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId }, {
      fields : {
        'createdAt' : 1
      }
    });
  } else {
    this.ready();
  }
});
