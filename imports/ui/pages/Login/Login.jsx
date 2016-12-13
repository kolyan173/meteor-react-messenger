import React, { Component } from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import countriesList from 'country-list';
import _ from 'lodash';
import { capitalizeFirstLetter } from '../../utils.js';
import Input from '../../components/FormElements/Input.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Form from '../../components/FormElements/Form.jsx';
// import { UserFormHoc } from '../../HOCs/UserFormHoc.js';

export default class Signup extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  submit = ({ email, password }) => {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) { return console.error(err); }

      this.context.router.push('/');
    });
  }

  render() {
    return (
      <div className="login">
        <PageHeader title="Login" />

        <Form
          onValidSubmit={this.submit}
          onValid={this.onValid}
          onInvalid={this.onInvalid}
          className="signin-form"
        >
          <Input
            name="email"
            value={this.email || ''}
            validations="isEmail"
            validationErrors={{
              isEmail: "Incorrect email"
            }}
            placeholder="Email address"
            required
          />
          <Input
            name="password"
            type="password"
            value={this.password || ''}
            validations={{
              minLength: 6,
              maxLength: 12
            }}
            validationErrors={{
              minLength: 'Password is too shirt. Minimum is 6 characters',
              maxLength: '"Password is too long. Maximim is 12 characters'
            }}
            placeholder="Password"
            required
          />

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
            >
              Sigin
            </button>
          </div>
        </Form>

        <div className="or-separator">
          <span>or</span>
          <Link to="/signup" className="btn btn-default"> Signup </Link>
        </div>
      </div>
    );
  }
}
