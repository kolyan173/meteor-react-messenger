import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class InfiniteScroll extends Component {
  static propTypes = {
    element: PropTypes.string,
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    loader: PropTypes.object,
    pageStart: PropTypes.number,
    threshold: PropTypes.number,
    useWindow: PropTypes.bool,
    isReverse: PropTypes.bool,
    shouldAttachScroll: PropTypes.bool,
    children: PropTypes.array.isRequired,
    basedElement: PropTypes.object,
    loaded: PropTypes.bool,
    detectBlindPoint: PropTypes.func
  }

  static defaultProps = {
    element: 'div',
    hasMore: true,
    initialLoad: false,
    pageStart: 1,
    threshold: 10,
    useWindow: false,
    isReverse: false,
    shouldAttachScroll: true,
    basedElement: null,
    loaded: false
  }

  constructor(props) {
    super(props);

    this.scrollListener = this.scrollListener.bind(this);
  }

  state = {
    initialLoad: false,
    scrollInitPosition: false,
    scrollBottomPosition: null,
    loading: false,
    inBlindPoint: false,
    scrollAttached: false
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;

    if (this.props.loaded) {
      // may be never happen
      debugger;
      this.scrollTop();
      this.attachScrollListener();
    }
  }

  componentWillReceiveProps(newProps, newState) {
    const { initialLoad } = newProps;
    const { basedElement, scrollTop, loaded, children } = this.props;
    const childrenUpdated = !_.isEqual(newProps.children, children);
    const isLoaded = !loaded && newProps.loaded;

    if (isLoaded) {
      if (!this.state.initialLoad) {
        this.setState({ initialLoad: true });
      } else {
        if (this.state.loading) {
          this.setState({ loading: false });
        }

        if (childrenUpdated) {
        }
      }
    }
  }

  componentWillUpdate(newProps, newState) {
    const { children, basedElement } = this.props;
    const childrenUpdated = !_.isEqual(newProps.children, children);

    if (basedElement && childrenUpdated) {
      this.scrollHeight = basedElement.scrollHeight;
      this.scrollTopPos = basedElement.scrollTop;
    }
  }

  componentDidUpdate(oldProps, oldState) {
    const initLoading = !oldState.initialLoad && this.state.initialLoad;
    const childrenUpdated = !_.isEqual(oldProps.children, this.props.children);

    if (initLoading) {
      if (this.props.loaded) {
        this.scrollTop(null, true);
      }
    }

    if (!_.isEqual(this.props, oldProps)) {
      if (childrenUpdated) {
        const lastMsg = _.last(this.props.children);
        const lastMsgOld = _.last(oldProps.children);
        const mine = _.result(lastMsg, 'props.authorId') === Meteor.userId();
        const isLastMessageUpdated = _.result(lastMsg, 'props.id') !== _.result(lastMsgOld, 'props.id');

        if (mine && isLastMessageUpdated) {
          this.scrollTop(null, true);
        }
      }
    }

    const isLoadingFinished = !this.state.loading && oldState.loading;

    if (isLoadingFinished) {
      const { basedElement } = this.props;
      basedElement.scrollTop = this.scrollTopPos + (basedElement.scrollHeight - this.scrollHeight);
    }

    if (!oldProps.loaded && this.props.loaded) {
      this.attachScrollListener();
    }
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  setDefaultLoader(loader) {
    this._defaultLoader = loader;
  }

  scrollTop(scrollBottom=this.state.scrollBottomPosition, instant) {
    const el = this.props.basedElement;
    const { scrollHeight, clientHeight } = el;

    if (!el) { return; }

    const scrollTop = scrollHeight - clientHeight - scrollBottom;

    if (instant) {
      el.scrollTop = scrollTop;
    } else {
      setTimeout(() => {
        el.scrollTop = scrollTop;
      }, 5e2);
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore || !this.props.shouldAttachScroll || this.state.scrollAttached) { return;}

    this.setState({ scrollAttached: true });
    let scrollEl = this.props.useWindow ? window : ReactDOM.findDOMNode(this).parentNode;

    scrollEl.addEventListener('scroll', this.scrollListener);
    scrollEl.addEventListener('resize', this.scrollListener);

    if (!this.state.initialLoad) {
      this.scrollListener();
    }
  }

  detachScrollListener() {
    let scrollEl = window;

    if (!this.props.useWindow) {
      scrollEl = ReactDOM.findDOMNode(this).parentNode;
    }

    scrollEl.removeEventListener('scroll', this.scrollListener);
    scrollEl.removeEventListener('resize', this.scrollListener);

    scrollEl.addEventListener('scroll', this.detectBlindPoint);

    this.setState({ scrollAttached: false });
  }

  scrollListener() {
    const el = this.props.basedElement || ReactDOM.findDOMNode(this);
    const scrollEl = window;

    let offset;

    if (this.props.useWindow) {
      const scrollTop = (scrollEl.pageYOffset !== undefined)
                        ? scrollEl.pageYOffset
                        : (document.documentElement || document.body.parentNode || document.body).scrollTop;

      if (this.props.isReverse) {
        offset = scrollTop;
      } else {
        offset = this.calculateTopPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
      }
    } else {
      if (this.props.isReverse) {
        offset = el.scrollTop;
      } else {
        offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
      }
    }

    this.detectBlindPoint();

    if (offset < Number(this.props.threshold)) {
      this.detachScrollListener();

      if (typeof this.props.loadMore === 'function') {
        this.setState({ loading: true });
        this.props.loadMore();
      }
    }
  }

  calculateTopPosition(el) {
    return el ? el.offsetTop + this.calculateTopPosition(el.offsetParent) : null;
  }

  detectBlindPoint = () => {
    const el = this.props.basedElement;

    if (el.scrollTop < el.scrollHeight - el.clientHeight - 70) {
      if (!this.state.inBlindPoint) {
        this.setState({ inBlindPoint: true });
        this.props.detectBlindPoint(true);
      }
    } else {
      if (this.state.inBlindPoint) {
        this.setState({ inBlindPoint: false });
        this.props.detectBlindPoint(false);
      }
    }
  }

  render() {
    const {
      children,
      element,
      hasMore,
      initialLoad,
      loader,
      loadMore,
      pageStart,
      threshold,
      useWindow,
      isReverse,
      ...props
    } = this.props;

    return (
      <div>
        {children}
      </div>
    );
    return React.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
  }
}
