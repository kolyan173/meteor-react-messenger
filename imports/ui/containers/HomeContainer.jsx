import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';
// import { Counts } from 'meteor/tmeasday:publish-counts';

import { Messages } from '../../api/messages/messages.js';
import Home from '../pages/Home/Home.jsx';

let currentLocationLoading = true;
let lastLoadedLocation;

const messages = {
  cursor: null,
  defaultLimit: 12,
  loading: true,
  initLoading: true,
  lastLoadedLocation: null,
  loadedLocationDataList: [],
  unloadedLocationDataList: [],
  loadedTotal: null,

  loadData(cb) {
    debugger;
    const limit = this.getMsgLimit();
    const nextLocation = _.last(this.unloadedLocationDataList);

    if (nextLocation && limit > 0) {
      const afterNextLoc = _(this.unloadedLocationDataList).initial().last();
      const extLocation = Object.assign(nextLocation, {
        limit,
        start: afterNextLoc ? afterNextLoc.finish : 0
      });

      this.processLocationData = this.unloadedLocationDataList.pop();
      this.loadedLocationDataList.push(this.processLocationData);

      return cb(true);
    }
    return cb();
  },
  getMsgLimit() {
    const forceLimit = Session.get('messagesCount') > this.defaultLimit &&  Session.get('messagesCount');
    return forceLimit || Session.get('messagesCount') - this.loadedTotal;
  }
};

// Session.set('messagesCount', null);

export default createContainer(() => {
  let oldMessages;
  let oldLocationData;
  let loadedMsgCount = 0;
  let messageCursor;


  console.log('createContainer', Messages.find().count());

  Session.setDefault('messagesCount', messages.defaultLimit);

  const user = Meteor.user();
  const { location, oldLocations } = user.profile;

  if (!messages.loadedTotal || messages.loadedTotal !== Messages.find().count()) {
    messages.loadedTotal = Messages.find().count();
    if (messages.initLoading) {
      messages.initLoading = false;

      const extLocation = {
        limit: messages.defaultLimit,
        location: user.profile.location
      };

      messages.unloadedLocationDataList = messages.unloadedLocationDataList.concat(oldLocations, [extLocation]);
      messages.processLocationData = messages.unloadedLocationDataList.pop();
      messages.loadedLocationDataList.push(messages.processLocationData);

      console.log('1111', messages.loadedLocationDataList);
      messageCursor = Meteor.subscribe('messages', messages.loadedLocationDataList, () => {
        if (messages.loadedTotal === Messages.find().count()) {
          messages.loadData((subscribe) => {
            if (!subscribe) { return; }
            console.log('invoke again');
            console.log('1111', messages.loadedLocationDataList);
            messageCursor = Meteor.subscribe('messages', messages.loadedLocationDataList);
          });
        }

      });
    } else {
        const limit = messages.getMsgLimit();
        const nextLocation = _.last(messages.unloadedLocationDataList);

        if (nextLocation && limit > 0) {
          const afterNextLoc = _(messages.unloadedLocationDataList).initial().last();
          const extLocation = Object.assign(nextLocation, {
            limit,
            start: afterNextLoc ? afterNextLoc.finish : 0
          });

          messages.processLocationData = messages.unloadedLocationDataList.pop();
          messages.loadedLocationDataList.push(messages.processLocationData);
          console.log('1111', messages.loadedLocationDataList);
          messageCursor = Meteor.subscribe('messages', messages.loadedLocationDataList, () => {
            if (messages.loadedTotal === Messages.find().count()) {
              messages.loadData((subscribe) => {
                if (!subscribe) { return; }
                console.log('invoke again');
                messageCursor = Meteor.subscribe('messages', this.loadedLocationDataList);
              });
            }

          });
        }

    }

  } else {
    debugger;
    messageCursor = Meteor.subscribe('messages', messages.loadedLocationDataList);
  }



  return {
    loading: !(messageCursor && messageCursor.ready()),
    messages: Messages.find({}, {sort: { createdAt: 1 }}).fetch(),
    limitMsgCount: messages.defaultLimit,
    messagesCount: Session.get('messagesCount')
  };
}, Home);
