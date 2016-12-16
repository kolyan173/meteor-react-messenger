import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import App from '../layouts/App.jsx';

const me = Meteor.subscribe('me');

export default createContainer(() => {
  return {
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen')
  };
}, App);
