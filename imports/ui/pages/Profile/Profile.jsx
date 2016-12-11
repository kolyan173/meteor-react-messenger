import React, { Component, PropTypes } from 'react';
import { update } from '../../../api/users/methods.js';
import InlineEdit from '../../components/InlineEdit/InlineEdit.jsx';
import Select from 'react-select';
import countriesList from 'country-list';

const { object } = PropTypes;
const countries = countriesList().getNames();
const fieldNames = [
  'email',
  'firstName',
  'lastName',
  'location'
];

export default class Profile extends Component {
  static propTypes = {
    user: object
  }

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
        const userProp = this.getUserProp(curr, user);

        if (userProp !== undefined) {
          prev[curr] = userProp;
        }

        return prev;
      }, {});

      this.setState(fields);
    }
  }

  getUserProp(name, user=this.props.user) {
    return name === 'email' ? user.emails[0].address : user[name];
  }

  handleSubmit = () => {
    update(this.state.user);
  }

  handleResetChange = () => {
    const { user } = this.props;
    const fields = fieldNames.reduce((prev, curr) =>  {
      prev[curr] = this.getUserProp(curr);

      return prev;
    }, {});

    this.setState(
      Object.assign(fields, { isEditable: false })
    );
  }

  handleFieldChange = (data) => {
    this.setState(data);
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
          onSubmit={this.handleSubmit}
        >
          <div className="form-group">
            <InlineEdit
              text={email}
              paramName="email"
              onChange={this.handleFieldChange}
              className="email"
              editing={isEditable}
            />
          </div>
          <div className="form-group">
            <Select
              name="form-field-name"
              value={location}
              options={this.state.countries}
              clearable={false}
              disabled={!isEditable}
              onChange={(data) => { this.handleFieldChange({location: data.value}) }}
            />
          </div>
          <div className="form-group">
            <InlineEdit
              text={firstName}
              staticElement="div"
              paramName="firstName"
              onChange={this.handleFieldChange}
              className="firstName"
              editing={isEditable}
            />
          </div>
          <div className="form-group">
            <InlineEdit
              text={lastName}
              staticElement="div"
              paramName="lastName"
              onChange={this.handleFieldChange}
              className="lastName"
              editing={isEditable}
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
