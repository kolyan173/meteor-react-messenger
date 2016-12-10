// import Meteor from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { update } from '../../../api/users/methods.js';
import Select from 'react-select';
import countriesList from 'country-list';

const countries = countriesList().getNames();
const fieldNames = [
  'email',
  'firstName',
  'lastName',
  'location'
];

export default class Profile extends Component {
  constructor(props) {
    super(props);

    const fields = fieldNames.reduce((prev, curr) =>  {
      prev[curr] = '';

      return prev;
    }, {});

    this.state = Object.assign({
      isEditable: false,
      countries: countries.map((item) => ({
        value: item.toLowerCase(),
        label: item
      }))
    }, fields);
  }

  componentWillReceiveProps(newProps) {
    const { user } = newProps;

    if (user && !_.isEqual(user, this.props.user)) {
      const fields = fieldNames.reduce((prev, curr) =>  {
        prev[curr] = this.getUserProp(curr, user);

        return prev;
      }, {});

      this.setState(fields);
    }
  }

  getUserProp(name, user=this.props.user) {
    return name === 'email' ? user.emails[0].address : user[name];
  }

  handleResetChange = () => {
    const { user } = this.props;
    const fields = fieldNames.reduce((prev, curr) =>  {
      prev[curr] = this.getUserProp(curr);

      return prev;
    }, {});

    this.setState(fields)
  }

  handleSendMessage = (e) => {
    e.preventDefault();

    // const user = Meteor.user();
    //
    // insert.call({
    //   text: this.state.messageText,
    //   authorId: user._id,
    //   authorName: user.firstName + ' ' + user.lastName;
    // });
  }

  handleFieldChange(field) {
    this.setState({ [field]: this.refs[field].value.trim() });
  }

  toggleEdit = (e) => {
    e.preventDefault();

    this.setState({ isEditable: !this.state.isEditable });
  }

  render() {
    const { messages } = this.props;
    const {
      email,
      location,
      firstName,
      lastName,
      isEditable
    } = this.state;

    return (
      <section className="profile">
        <div className="page-header">
          <h1>Profile</h1>
        </div>
        <form
          className="profile-form"
          onSubmit={this.handleSendMessage}
        >
          <div className="form-group">
            <input
              className="email"
              type="text"
              ref="email"
              value={email}
              onChange={this.handleFieldChange.bind(this, 'email')}
              disabled={!isEditable}
            />
          </div>
          <div className="form-group">
            <Select
              name="form-field-name"
              value={location}
              options={this.state.countries}
              disabled={!isEditable}
            />
          </div>
          <input
            type="submit"
            className="btn btn-success"
            value="Edit"
            onClick={this.toggleEdit}
          />
          <input
            type="button"
            className="btn"
            value="Cancel"
            onClick={this.handleResetChange}
          />
        </form>
      </section>
    );
  }
}
