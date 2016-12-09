// import { Meteor } from 'meteor/meteor';
// import { Messages } from '../../api/messages/messages.js';

// Meteor.startup(() => {
//   if (!Messages.find()) {
//     const data = [
//       {
//         authorId: '5rpjWF3ioK4XtEr7C',
//         text: 'Data on the Wire'
//       }
//     ];
//
//     let timestamp = (new Date()).getTime();
//
//     data.forEach((item, index) => {
//       Messages.insert(
//         Object.assign(item, {
//           createdAt: timestamp + index
//         })
//       );
//     });
//   }
// });
