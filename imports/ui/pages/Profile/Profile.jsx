import React, { Component, PropTypes } from 'react';
import { update } from '../../../api/users/methods.js';
import InlineEdit from '../../components/InlineEdit/InlineEdit.jsx';
import Select from 'react-select';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import countriesList from 'country-list';
import { UserFormHoc } from '../../HOCs/UserFormHoc.js';

const { object } = PropTypes;

@UserFormHoc
export default class Profile extends Component {
  countries = countriesList().getNames()
                      .map((item) => ({
                        value: item.toLowerCase(),
                        label: item
                      }))

  fieldNames = [
    'email',
    'username',
    'location'
  ]

  static propTypes = {
    user: object
  }

  constructor(props) {
    super(props);

    this.fieldNames.forEach((item) => this[item] = '');

    this.state = {
      errors: {},
      isEditable: false,
      location: ''
    };
  }

  componentWillReceiveProps(newProps) {
    const { user } = newProps;

    if (user && !_.isEqual(user, this.props.user)) {
      this.fieldNames.forEach((item) =>  {
        const userProp = this.getUserProp(item, user);

        if (userProp !== undefined) {
          this[item] = userProp;
        }
      });

      this.setState({ location: user.location });
    }
  }

  getUserProp(name, user=this.props.user) {
    return name === 'email' ? user.emails[0].address : user[name];
  }

  handleSubmit = () => {
    const { user } = this.props;
    const data = this.fieldNames.reduce((prev, curr) => {
      const userNewProp = curr === 'location' ? this.state.location : this[curr];

      if (this.getUserProp(curr) !== userNewProp) {
        prev[curr] = userNewProp;
      }

      return prev;
    }, {});
    console.log(data);
    // update(data);
  }

  handleResetChange = () => {
    const { user } = this.props;

    this.fieldNames.forEach((item) => this[item] = this.getUserProp(item));

    this.setState({ isEditable: false, location: user.location });
  }

  toggleEdit = (e) => {
    e.preventDefault();

    this.setState({ isEditable: !this.state.isEditable });
  }

  render() {
    const { messages } = this.props;
    const { isEditable, location } = this.state;

    return (
      <section className="profile">
          <PageHeader title="Profile" />

        <form
          className="profile-form"
          onSubmit={this.handleSubmit}
        >
          <div className="form-group">
            <InlineEdit
              text={this.email}
              editing={isEditable}
              className="email"
              paramName="email"
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              fieldError={this.fieldError}
              onError={this.handleError}
              validate={this.validateEmail}
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-group">
            <Select
              name="form-field-name"
              value={location}
              options={this.countries}
              clearable={false}
              disabled={!isEditable}
              onChange={(data) => { this.handleFieldChange({location: data.value}, 'location') }}
            />
          </div>
          <div className="form-group">
            <InlineEdit
              text={this.username}
              editing={isEditable}
              className="username"
              paramName="username"
              placeholder="username"
              onBlur={this.handleBlur}
              onChange={this.handleFieldChange}
              fieldError={this.fieldError}
              onError={this.handleError}
              validate={this.validateUsername}
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
