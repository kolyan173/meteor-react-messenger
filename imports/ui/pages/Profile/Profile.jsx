import React, { Component, PropTypes } from 'react';
import { objectsDiff } from '../../utils.js';
import { update } from '../../../api/users/methods.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import InlineEdit from '../../components/InlineEdit/InlineEdit.jsx';
import Form from '../../components/FormElements/Form.jsx';
import countriesList from 'country-list';
import _ from 'lodash';

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
      isEditable: false
    };
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

    return fields;
  }

  submit = (data) => {
    console.log(_.pick(data, this.defineChangedFields(data)));
    // update.call(data);
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

  render() {
    const { messages, user } = this.props;
    const { isEditable, reset } = this.state;

    return (
      <section className="profile">
        <PageHeader title="Profile" />

        <Form onValidSubmit={this.submit} onValid={this.onValid} onInvalid={this.onInvalid}
          isEditable={isEditable}
          className="profile-form"
          reset={reset}
          onReset={this.handleReset}
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
            value={_.result(user, 'profile.location') || ''}
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
            value={_.result(user, 'username') || ''}
            validations={{
              minLength: 3
            }}
            validationErrors={{
              minLength: "Username is too shirt. Minimum 3 characters."
            }}
            placeholder="Username"
          />

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
      </section>
    );
  }
}
