import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { Messages } from '../../api/messages/messages.js';
import Home from '../pages/Home/Home.jsx';
import messagesStore from '../stores/messages';

let currentLocationLoading = true;
let lastLoadedLocation;

export default createContainer(() => {
  const user = Meteor.user();
  const { location, oldLocations } = user.profile;
  const loadedMsgCount = Messages.find().count();

  let messageCursor;

  Session.setDefault('messagesLimit', messagesStore.getDefaultLimit());

  if (messagesStore.initLoading) {
    messagesStore.initLoading = false;

    const extLocation = {
      limit: messagesStore.limit,
      location: user.profile.location
    };

    messagesStore.unloadedLocationDataList = messagesStore.unloadedLocationDataList.concat(oldLocations, [extLocation]);
    messagesStore.processLocationData = messagesStore.unloadedLocationDataList.pop();
    messagesStore.loadedLocationDataList.push(messagesStore.processLocationData);
    console.log('init subscribe');
    messageCursor = Meteor.subscribe('messages', messagesStore.loadedLocationDataList, () => {
      // if (messagesStore.loadedTotal === loadedMsgCount) {
        // messagesStore.loadData((subscribe) => {
        //   if (!subscribe) { return; }
        //   console.log('invoke again');
        //   console.log('1111', messagesStore.loadedLocationDataList);
        //   messageCursor = Meteor.subscribe('messages', messagesStore.loadedLocationDataList);
        // });
      // }

    });
  } else {
    const messagesLimit = Session.get('messagesLimit');
    const shouldLoadMore = messagesLimit > loadedMsgCount;
    const currLocationFullLoaded = messagesStore.processLocationData && messagesStore.processLocationData.limit === messagesLimit;
    const nextLocation = _.last(messagesStore.unloadedLocationDataList);
    const noDataMore = currLocationFullLoaded && !nextLocation;

    console.log('createContainer', loadedMsgCount);

    if (!noDataMore && messagesLimit > loadedMsgCount) {
      messagesStore.loadedTotal = loadedMsgCount;
      messagesStore.loaded = false;

      const limit = messagesStore.getMsgLimit();
      // const loadMore = Session.get('messagesLimit') > messagesStore.limit;

      if (((shouldLoadMore && !currLocationFullLoaded) || nextLocation) && limit > 0) {
        if (currLocationFullLoaded) {
          const afterNextLoc = _(messagesStore.unloadedLocationDataList).initial().last();
          const extLocation = Object.assign(nextLocation, {
            limit,
            start: afterNextLoc ? afterNextLoc.finish : 0
          });

          messagesStore.processLocationData = messagesStore.unloadedLocationDataList.pop();
          messagesStore.loadedLocationDataList.push(messagesStore.processLocationData);
        } else {
          _.last(messagesStore.loadedLocationDataList).limit = messagesStore.processLocationData.limit = Session.get('messagesLimit');
        }
        console.log('main subscribe', messagesStore.loadedLocationDataList);
        messageCursor = Meteor.subscribe('messages', messagesStore.loadedLocationDataList, () => {
          // if (messagesStore.loadedTotal === loadedMsgCount) {
          //   messagesStore.loadData((subscribe) => {
          //     if (!subscribe) { return; }
          //     console.log('invoke again');
          //     messageCursor = Meteor.subscribe('messages', this.loadedLocationDataList);
          //   });
          // }

        });
      }
    } else {
      messagesStore.loaded = true;
      console.log('LOADED', messagesStore.loaded);
    }
  }

  if (!messageCursor) {
    messageCursor = Meteor.subscribe('messages', messagesStore.loadedLocationDataList);
  }

  messagesStore.limit = Session.get('messagesLimit');

  return {
    loading: !(messageCursor && messageCursor.ready()),
    messages: Messages.find({}, {sort: { createdAt: 1 }}).fetch(),
    limitMsgCount: Session.get('messagesLimit'),
    defaultMsgLimit: messagesStore.getDefaultLimit(),
    messagesLoaded: messagesStore.loaded
  };
}, Home);
