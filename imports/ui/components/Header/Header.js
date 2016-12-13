import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';

const { any, object } = PropTypes;

export default class Header extends Component {
  static propTypes = {
    user: any
  }

  static contextTypes = {
    router: object
  }

  constructor(props) {
    super(props);

    this.state = { openModal: false };
  }

  handleLogout = () => {
    this.setState({ openModal: true });
  }

  handlConfirmLogout = () => {
    this.setState({ openModal: true });
    Meteor.logout();

    this.context.router.push(`/login`);
  }

  handleCloseModal = () => {
    this.setState({ openModal: false });
  }

  render() {
    const { user } = this.props;
    const customStyles = {
      content : {
        top : '50%',
        left : '50%',
        right : 'auto',
        bottom : 'auto',
        marginRight : '-50%',
        transform : 'translate(-50%, -50%)'
      }
    };

    return (
      <nav className="header navbar navbar-inverse navbar-fixed-top">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">
            Messaging Keenethics
          </Link>
        </div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            { !user &&
              <li>
                <Link to="/signup">
                  Signup
                </Link>
              </li>
            }
            { !user &&
              <li>
                <Link to="/login">
                  Login
                </Link>
              </li>
            }
            { user &&
              <li>
                <Link to="/profile">
                  Profile
                </Link>
              </li>
            }
            { user &&
              <li>
                <a onClick={this.handleLogout}>
                  Logout
                </a>
              </li>
              }
          </ul>
        </div>
        <Modal
          isOpen={this.state.openModal}
          onRequestClose={this.handleCloseModal}
          contentLabel="Modal"
          style={customStyles}
        >
          <div className="modal-header">
          </div>
          <div className="modal-body">
            <h4>Are you sure you want to leave from this awesome place?</h4>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={this.handlConfirmLogout}
            >
              Yes
            </button>
            <button
              className="btn btn-default"
              onClick={this.handleCloseModal}
            >
              No
            </button>
          </div>
        </Modal>
      </nav>
    );
  }
}
