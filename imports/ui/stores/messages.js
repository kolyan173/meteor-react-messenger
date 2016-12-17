class MessagesStore {
  constructor() {
    this.limit = this.getDefaultLimit();
    this.loading = true;
    this.initLoading = true;
    this.lastLoadedLocation = null;
    this.loadedLocationDataList = [];
    this.unloadedLocationDataList = [];
    this.loadedTotal = 0;
    this.loaded = false;
    this.processLocationData = null;

    Session.set('messagesLimit', this.getDefaultLimit());
  }

  loadMore(delta=this.getDefaultLimit()) {
    console.log('loadMore', delta);
    const messagesLimit = Session.get('messagesLimit');
    return Session.set('messagesLimit', messagesLimit + delta);
  }

  chargeNextLocation() {
    this.processLocationData = this.unloadedLocationDataList.pop();
    return this.loadedLocationDataList.push(this.processLocationData);
  }

  getDefaultLimit() {
    return 15;
  }

  loadData(cb) {
    const limit = this.getMsgLimit();
    const nextLocation = _.last(this.unloadedLocationDataList);

    if (nextLocation && limit > 0) {
      const afterNextLoc = _(this.unloadedLocationDataList).initial().last();
      const extLocation = Object.assign(nextLocation, {
        limit,
        start: afterNextLoc ? afterNextLoc.finish : 0
      });

      this.chargeNextLocation();

      return cb(true);
    }

    return cb();
  }

  getRestCount(loadedCount) {
    return Session.get('messagesLimit') - loadedCount;
  }

  upLimit(loadedMsgCount) {
    return _.last(this.loadedLocationDataList).limit = this.processLocationData.limit = this.getRestCount(loadedMsgCount);
  }

  reset() {
    this.loading = true;
    this.initLoading = true;
    this.lastLoadedLocation = null;
    this.loadedLocationDataList = [];
    this.unloadedLocationDataList = [];
    this.loaded = false;
    this.processLocationData = null;
    this.loadedTotal = null;

    Session.set('messagesLimit', this.getDefaultLimit());
  }
}

const messages = new MessagesStore();

export default messages;
