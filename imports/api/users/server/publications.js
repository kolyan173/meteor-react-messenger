import { Meteor } from 'meteor/meteor';

Meteor.publish('me', function() {
  console.log('USER PUBLISH');
  if (this.userId) {
    console.log(Meteor.users.find({_id: this.userId }, {
      fields : {
        'createdAt' : 1
      }
    }));
    return Meteor.users.find({_id: this.userId }, {
      fields : {
        'createdAt' : 1
      }
    });
  } else {
    this.ready();
  }
});
