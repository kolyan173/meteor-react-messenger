import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Input } from '../../components/FormElements/Input.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import _ from 'lodash';
import { capitalizeFirstLetter } from '../../utils.js';
import { UserFormHoc } from '../../HOCs/UserFormHoc.js';

@UserFormHoc
export default class Signup extends Component {
  constructor(props) {
    super(props);
  }

  state = { errors: {} }

  onSubmit = (event) => {
    event.preventDefault();

    const fields = [
      'email',
      'password',
      'confirm'
    ];
    const errors = {};

    fields.forEach((item) => {
      if (!this[item]) {
        errors[item] = 'This field is required';
      } else if (this.state.errors[item]) {
        return;
      } else {
        this.validateField(item);
      }
    });


    if (_.size(errors)) {
      return this.setErrors(errors);
    }
    //
    // Accounts.createUser({
    //   email,
    //   password,
    // }, (err) => {
    //   if (err) {
    //     this.setState({
    //       errors: { none: err.reason },
    //     });
    //   }
    //   this.context.router.push('/');
    // });
  }

  render() {
    return (
      <div className="signup">
        <PageHeader title="Signup" />

        <form onSubmit={this.onSubmit} noValidate>
          <Input
            error={this.fieldError('email')}
            onError={this.handleError}
            type="email"
            name="email"
            validate={this.validateEmail}
            placeholder="Email address"
            onBlur={this.handleBlur}
            onChange={this.handleFieldChange}
            required
            noValidate
          />
          <Input
            error={this.fieldError('password')}
            onError={this.handleError}
            type="password"
            name="password"
            placeholder="Password"
            validate={this.validatePassword}
            onBlur={this.handleBlur}
            onChange={this.handleFieldChange}
            required
          />
          <Input
            error={this.fieldError('confirm')}
            onError={this.handleError}
            type="password"
            name="confirm"
            placeholder="Confirm password"
            validate={this.validatePassword}
            onBlur={this.handleBlur}
            onChange={this.handleFieldChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!this.isNoErrors()}
          >
            Signup
          </button>
        </form>
      </div>
    );
  }
}
