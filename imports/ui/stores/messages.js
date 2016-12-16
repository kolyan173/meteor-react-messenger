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
    this.loaded = false;

    Session.set('messagesLimit', this.getDefaultLimit());
  }

  loadMore() {
    Session.set('messagesLimit', Session.get('messagesLimit') + this.getDefaultLimit());
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

      this.processLocationData = this.unloadedLocationDataList.pop();
      this.loadedLocationDataList.push(this.processLocationData);

      return cb(true);
    }

    return cb();
  }

  getMsgLimit() {
    const forceLimit = Session.get('messagesLimit') > this.limit &&  Session.get('messagesLimit');
    return forceLimit || Session.get('messagesLimit') - this.loadedTotal;
  }

  reset() {
    this.cursor = null;
    this.limit = 12;
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
