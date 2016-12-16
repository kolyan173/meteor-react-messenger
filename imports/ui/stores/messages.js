class MessagesStore {
  constructor() {
    this.cursor = null;
    this.limit = this.getDefaultLimit();
    this.loading = true;
    this.initLoading = true;
    this.lastLoadedLocation = null;
    this.loadedLocationDataList = [];
    this.unloadedLocationDataList = [];
    this.loadedTotal = null;
    this.loaded = true;

    Session.set('messagesLimit', this.getDefaultLimit());
  }

  loadMore() {
    return Session.set('messagesLimit', Session.get('messagesLimit') + this.getDefaultLimit());
  }

  chargeNextLocation() {
    console.log('chargeNextLocation');
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
    console.log('this.loadedTotal', loadedCount);
    return Session.get('messagesLimit') - loadedCount;
  }

  upLimit(loadedMsgCount) {
    console.log('upLimit');
    return _.last(this.loadedLocationDataList).limit = this.processLocationData.limit = this.getRestCount(loadedMsgCount);
  }

  reset() {
    this.cursor = null;
    this.loading = true;
    this.initLoading = true;
    this.lastLoadedLocation = null;
    this.loadedLocationDataList = [];
    this.unloadedLocationDataList = [];
    this.loaded = false;
    this.loadedTotal = null;

    Session.set('messagesLimit', this.getDefaultLimit());
  }
}

const messages = new MessagesStore();

export default messages;
