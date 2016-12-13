import React, { Component, PropTypes } from 'react';
import { objectsDiff, capitalizeFirstLetter } from '../../utils.js';
import { update } from '../../../api/users/methods.js';
import Input from '../../components/FormElements/Input.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import InlineEdit from '../../components/InlineEdit/InlineEdit.jsx';
import Form from '../../components/FormElements/Form.jsx';
import countriesList from 'country-list';
import _ from 'lodash';
import Modal from 'react-modal';
import { Accounts } from 'meteor/accounts-base';

const { object } = PropTypes;

export default class Profile extends Component {
  static propTypes = {
    user: object
  }

  constructor(props) {
    super(props);

    this.countries = countriesList().getNames()
      .map((item) => ({
        value: item.toLowerCase(),
        label: item
      })
    );

    this.state = {
      isEditable: false,
      openModal: false
    };

    this.formData = {}
  }

  handleResetChange = () => {
    const { user } = this.props;

    // this.fields.forEach((item) => this[item] = this.getUserProp(item));
    this.setState({
      isEditable: false,
      reset: true
    });
  }

  toggleEdit = (e) => {
    if (this.state.isEditable) { return; }

    e.preventDefault();
    this.setState({ isEditable: !this.state.isEditable });
  }

  defineChangedFields(data) {
    const { user } = this.props;
    const fields = [];

    if (user.emails[0].address !== data.email) {
      fields.push('email');
    }
    if (user.profile.location !== data.location) {
      fields.push('location');
    }

    const filled = user.username || data.username;
    if (filled && user.username !== data.username) {
      fields.push('username');
    }

    if (data.newpassword) {
      fields.push('newpassword');
    }

    if (data.password) {
      fields.push('password');
    }

    return fields;
  }

  submit = (data) => {
    const formData = Object.assign(this.formData, data);
    const changes = _.pick(formData, this.defineChangedFields(formData));

    if (changes.newpassword && !changes.password) {
      return this.setState({ openModal: true });
    }

    if (changes.password) {
      Accounts.changePassword(changes.password, changes.newpassword, (err) => {
        if (err) { return console.error(err); }

        update.call(
          _.omit(changes, ['newpassword', 'password']),
          this.handleUpdatingUser.bind(this)
        );
      });
    } else {
      update.call(changes, this.handleUpdatingUser.bind(this));
    }
  }

  handleUpdatingUser(err) {
    if (err) { return console.error(err); }

    this.setState({ isEditable: false, openModal: false });
    this.formData = {};
  }

  onValid = (data) => {
    // console.log(data);
  }

  onInvalid = (data) => {
    // console.log(data);
  }

  handleReset = () => {
    this.setState({ reset: false });
  }

  handleCloseModal = () => {
    this.setState({ openModal: false });
  }

  render() {
    const { messages, user } = this.props;
    const { isEditable, reset } = this.state;
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
    const location = _.result(user, 'profile.location')
    const locationLabel = location && capitalizeFirstLetter(location);

    return (
      <section className="profile">
        <PageHeader title="Profile" />

        <Form onValidSubmit={this.submit} onValid={this.onValid} onInvalid={this.onInvalid}
          isEditable={isEditable}
          className="profile-form"
          reset={reset}
          onReset={this.handleReset}
          ref="form"
        >
          <InlineEdit
            editing={isEditable}
            name="email"
            value={_.result(user, 'emails[0].address') || ''}
            validations="isEmail"
            validationErrors={{
              isEmail: "Incorrect email"
            }}
            required
            placeholder="Email address"
          />
          <InlineEdit
            editing={isEditable}
            type="select"
            name="location"
            value={location || ''}
            label={locationLabel}
            validations={{
              isExisty: true
            }}
            validationErrors={{
              isExisty: 'Required field'
            }}
            options={this.countries}
            required
            placeholder="Choose location"
          />
          <InlineEdit
            editing={isEditable}
            name="username"
            label="Anonymous"
            value={_.result(user, 'username') || ''}
            validations={{
              minLength: 3
            }}
            validationErrors={{
              minLength: "Username is too shirt. Minimum 3 characters."
            }}
            placeholder="Username"
          />

          {isEditable &&
            <Input
              name="newpassword"
              type="password"
              value=""
              validations={{
                minLength: 6,
                maxLength: 12
              }}
              validationErrors={{
                minLength: 'Password is too shirt. Minimum is 6 characters',
                maxLength: '"Password is too long. Maximim is 12 characters'
              }}
              placeholder="Password"
            />
          }

          {isEditable &&
            <Input
              name="confirm"
              type="password"
              value=""
              validations={{
                equalsField: 'newpassword',
                minLength: 6,
                maxLength: 12
              }}
              validationErrors={{
                minLength: 'Password is too shirt. Minimum is 6 characters',
                maxLength: '"Password is too long. Maximim is 12 characters',
                equalsField: 'Passwords mismatch'
              }}
              placeholder="Confirm password"
            />
          }

          <input
            type={ isEditable ? 'submit' : 'button' }
            className="btn btn-success"
            value={ isEditable ? 'Save' : 'Edit' }
            onClick={this.toggleEdit}
          />

          { isEditable &&
            <input
              type="button"
              className="btn btn-default"
              value="Cancel"
              onClick={this.handleResetChange}
            />
          }
        </Form>

        <Modal
          isOpen={this.state.openModal}
          onRequestClose={this.handleCloseModal}
          contentLabel="Modal"
          style={customStyles}
        >
          <div className="modal-header">
            <h4>Change password</h4>
          </div>
          <div className="modal-body">
            <p>To change password you need to enter current one</p>

            <input
              className="form-control"
              type="password"
              placeholder="Current password"
              onChange={(e) => {this.formData.password = e.target.value; }}
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={this.submit.bind(this, this.formData)}
              type="submit"
            >
              Submit
            </button>
          </div>
        </Modal>
      </section>
    );
  }
}
