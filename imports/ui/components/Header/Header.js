import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Auth from '../Auth/Auth.jsx';

const { any } = PropTypes;

export default class Header extends Component {
  static propTypes = {
    user: any
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;

    return (
      <nav className="header navbar navbar-inverse navbar-fixed-top">
        <div className="navbar-header">
          <a className="navbar-brand" href="">
            Messaging Keenethics
          </a>
        </div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            { !user && <li style={{padding: '10px 15px'}}><Auth /></li> }
            { user && <li><Link to="/profile">Profile</Link></li> }
          </ul>
        </div>
      </nav>
    );
  }
}
