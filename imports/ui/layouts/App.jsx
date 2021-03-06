import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import Header from '../components/Header/Header.js';

const { object, bool, array, element } = PropTypes;
const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends Component {
  static propTypes = {
    user: object,
    connected: bool,
    loading: bool,
    menuOpen: bool,
    children: element,
    location: object,
    params: object,
  }

  static contextTypes = {
    router: object
  }

  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      showConnectionIssue: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children, location }) {
    // redirect / to a list once lists are ready
    // if (!loading && !children) {
    //   const list = Lists.findOne();
    //   this.context.router.replace(`/lists/${list._id}`);
    // }
  }

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      menuOpen,
      children,
      location,
    } = this.props;

    return (
      <div id="container" className={`${menuOpen ? 'menu-open' : ''}`}>
        { !['/login', '/signup'].includes(location.pathname) &&
          <Header {...this.props} />
        }

        <div
          id="content-container"
          className="jumbotron container"
        >
          {children}
        </div>
      </div>
    );
  }
}
