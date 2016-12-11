import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Input } from '../../components/FormElements/Input.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import _ from 'lodash';
import isPlainObject from 'lodash.isplainobject';

export default class Signup extends Component {
  state = { errors: {} };

  handleFieldChange = (e) => {
    const { target } = e;

    this[target.name] = target.value;
  }

  handleError = (data) => {
    this.setErrors(data);
    console.log(data, this.state.errors);
  }

  setErrors(field, value) {
    let data = { [field]: value };

    if (isPlainObject(field)) {
      data = field;
    }

    this.setState({ errors : Object.assign(this.state.errors, data) });
  }

  validatePassword = (name) => {
    if (!this.password) { return 'This field is required'; }

    if (this.password.length > 5) {
      console.log(name, this.confirm);
      if (name === 'confirm') {
        if (this.password === this.confirm) {
          return this.setErrors(name, null);
        }

        return 'Passwords mismatch';
      }
    } else {
      return 'Password is too shirt. Minimum characters count is 6';
    }
  }

  onSubmit = (event) => {
    debugger;
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const confirm = this.confirm.value;
    const errors = {};

    if (!email) {
      errors.email = i18n.__('pages.authPageJoin.emailRequired');
    }
    if (!password) {
      errors.password = i18n.__('pages.authPageJoin.passwordRequired');
    }
    if (confirm !== password) {
      errors.confirm = i18n.__('pages.authPageJoin.passwordConfirm');
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email,
      password,
    }, (err) => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
    });
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const fieldError = key => errors[key];

    return (
      <div className="signup">
        <PageHeader title="Signup" />

        <form onSubmit={this.onSubmit}>
          <Input
            error={fieldError('email')}
            type="email"
            name="email"
            placeholder="Email address"
            onChange={this.handleFieldChange}
          />
          <Input
            error={fieldError('password')}
            onError={this.handleError}
            type="password"
            name="password"
            placeholder="Password"
            validate={this.validatePassword}
            onChange={this.handleFieldChange}
            required
          />
          <Input
            error={fieldError('confirm')}
            onError={this.handleError}
            type="password"
            name="confirm"
            placeholder="Password"
            validate={this.validatePassword}
            onChange={this.handleFieldChange}
          />

          <button type="submit" className="btn-primary">
            {i18n.__('pages.authPageJoin.joinNow')}
          </button>
        </form>
      </div>
    );
  }
}
