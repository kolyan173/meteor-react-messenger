import React, { Component } from 'react';
import isPlainObject from 'lodash.isplainobject';


const a = () => {
  return class A {} }

const UserFormHoc = (ComposedComponent) => class UserFormHoc extends Component {
  static displayName = 'UserFormHoc';

  constructor(props) {
    super(props);
  }

  setErrors(field, value) {
    let data = { [field]: value };

    if (isPlainObject(field)) {
      data = field;
    }

    this.setState({ errors : Object.assign(this.state.errors, data) });
  }

  validatePassword(name) {
    if (!this[name]) {
      return this.setErrors(name, 'This field is required');
    }

    const tooShirtMsg = 'Password is too shirt. Minimum characters count is 6';

    if (this.password.length > 5) {
      if (name === 'confirm') {
        if (this.confirm.length > 5) {
          if (this.password === this.confirm) {
            return this.setErrors(name, null);
          } else {
            return this.setErrors(name, 'Passwords mismatch');
          }
        } else {
          return this.setErrors(name, tooShirtMsg);
        }
      }

      return this.setErrors(name, null);
    } else {
      return this.setErrors(name, tooShirtMsg);
    }
  }

  validateEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(this.email)) {
      return this.setErrors('email', null);
    }

    return this.setErrors('email', 'Incorrect email');
  }

  validateField(field) {
    if (field === 'email') {
      return this.validateEmail();
    }

    return this.validatePassword(field);
  }

  handleFieldChange(e) {
    const { target } = e;
    const { name } = target;

    this[target.name] = target.value;

    if (this.state.errors[name]) {
      this.validateField(name);
    }
  }

  isNoErrors() {
    return !_.find(this.state.errors, _.identity);
  }

  render() {
    return <ComposedComponent {...this.props} {...this.state} />;
  }
};

export UserFormHoc;
