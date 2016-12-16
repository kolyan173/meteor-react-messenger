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
    loaded: PropTypes.bool
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

  state = { initialLoad: true, scrollInitPosition: false }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;

    if (this.props.loaded) {
      this.attachScrollListener();
    }
  }

  componentWillReceiveProps(newProps) {
    const { initialLoad } = newProps;
    const { basedElement } = this.props;

    if (this.state.initialLoad && !initialLoad) {
      this.setState({ initialLoad });
    }

    this.setState({ scrollPosition: basedElement && basedElement.scrollHeight })
  }

  componentDidUpdate(oldProps, oldState) {
    if (!_.isEqual(this.props, oldProps)) {
      if (this.props.loaded) {
        this.attachScrollListener();
      }
    }
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  setDefaultLoader(loader) {
    this._defaultLoader = loader;
  }

  attachScrollListener() {
    if (!this.props.hasMore || !this.props.shouldAttachScroll) {
      return;
    }

    let scrollEl = this.props.useWindow ? window : ReactDOM.findDOMNode(this).parentNode;

    scrollEl.addEventListener('scroll', this.scrollListener);
    scrollEl.addEventListener('resize', this.scrollListener);

    if (this.state.initialLoad) {
    } else {
      if (!this.state.scrollInitPosition) {
        const el = this.props.basedElement;
        el.scrollTop = el.scrollHeight;

        this.setState({ scrollInitPosition: true });
      }

      const el = this.props.basedElement;
      el.scrollTop = el.scrollHeight - this.state.scrollPosition - 1;
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

    if (offset < Number(this.props.threshold)) {
      this.detachScrollListener();

      if (typeof this.props.loadMore === 'function') {
        this.props.loadMore(this.pageLoaded += 1);
      }
    }
  }

  calculateTopPosition(el) {
    return el ? el.offsetTop + this.calculateTopPosition(el.offsetParent) : null;
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
