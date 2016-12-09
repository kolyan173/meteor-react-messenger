import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Profile from '../pages/Profile/Profile.jsx';

export default createContainer(() => {
  return {
    loading: !Meteor.user(),
    user: Meteor.user()
  };
}, Profile);
