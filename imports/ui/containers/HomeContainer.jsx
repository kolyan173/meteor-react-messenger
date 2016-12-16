import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';
import moment from 'moment';
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
    if (user.createdAt) {
      messagesStore.initLoading = false;

      const extLocation = {
        limit: messagesStore.limit,
        location: user.profile.location
      };

      messagesStore.unloadedLocationDataList = messagesStore.unloadedLocationDataList.concat(oldLocations, [extLocation]);
      messagesStore.chargeNextLocation();
      messageCursor = Meteor.subscribe('messages', messagesStore.loadedLocationDataList);
    }
  } else {
    const messagesLimit = Session.get('messagesLimit');
    const shouldLoadMore = messagesLimit > loadedMsgCount;
    const currLocationFullLoaded = messagesStore.processLocationData.limit >= messagesLimit;
    const nextLocation = _.last(messagesStore.unloadedLocationDataList);
    const noDataMore = currLocationFullLoaded && !nextLocation;
    const currLocationEmpty = messagesStore.loadedTotal === loadedMsgCount;

    if (!noDataMore && shouldLoadMore) {
      const limit = messagesStore.getRestCount(loadedMsgCount);
      const canLoadMore = !currLocationFullLoaded || nextLocation;

      if (canLoadMore) {
        const shouldRechargeLoc = currLocationEmpty || currLocationFullLoaded;

        if (shouldRechargeLoc && nextLocation) {
          const afterNextLoc = _(messagesStore.unloadedLocationDataList).initial().last();
          const extLocation = Object.assign(nextLocation, {
            limit,
            start: afterNextLoc ? afterNextLoc.finish : moment(user.createdAt).valueOf()
          });

          messagesStore.chargeNextLocation();
        } else {
          messagesStore.upLimit(loadedMsgCount);
        }

        messagesStore.loaded = false;
        messagesStore.loadedTotal = loadedMsgCount;

        messageCursor = Meteor.subscribe('messages', messagesStore.loadedLocationDataList);
      }
    } else {
      messagesStore.loaded = true;
    }
  }

  if (!messageCursor) {
    messagesStore.loadedTotal = loadedMsgCount;
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
