// import Meteor from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { update } from '../../../api/users/methods.js';
import Select from 'react-select';
import countriesList from 'country-list';

const countries = countriesList().getNames();

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      location: '',
      countries: countries.map((item) => ({
        value: item.toLowerCase(),
        label: item
      }))
    };
  }

  componentWillReceiveProps(newProps) {
    const { user } = newProps;

    if (newProps.user) {
      this.setState({
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
      });
    }
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

  handleType = (e) => {
    // this.setState({ messageText: e.target.value });
  }

  render() {
    const { messages } = this.props;
    const { email, location, firstName, lastName } = this.state;

    return (
      <div className="profile">
        <form
          className="profile-form"
          onSubmit={this.handleSendMessage}
        >
          <div className="form-group">
            <input
              className="email"
              type="text"
              value={email}
              onChange={this.handleFieldChange}
              disabled={false}
            />
          </div>
          <div className="form-group">
            <Select
              name="form-field-name"
              value={location}
              options={this.state.countries}
            />
          </div>
          <input
            type="submit"
            className="btn btn-success"
            value="Send"
          />
        </form>
      </div>
    );
  }
}
