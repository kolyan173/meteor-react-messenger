import React, { Component } from 'react';
import isPlainObject from 'lodash.isplainobject';

export const UserFormHoc = ComposedComponent => class extends ComposedComponent {
  fieldError = key => this.state.errors[key];

  validatePassword = (name) => {
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

  validateEmail = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(this.email)) {
      return this.setErrors('email', null);
    }

    return this.setErrors('email', 'Incorrect email');
  }

  validateUsername = () => {
    return this.setErrors(
      'username',
      this.username.length > 3 ? null : 'Too shirt username'
    );
  }

  handleFieldChange = (data, field) => {
    let name;

    if (field === 'location') {
      this.setState(data)

      name = field;
    } else {
      const { target } = data;

      name = target.name;

      this[target.name] = target.value;
    }

    if (this.state.errors[name]) {
      this.validateField(name);
    }
  }

  handleBlur = (e) => {
    this.validateField(e.target.name);
  }

  setErrors(field, value) {
    let data = { [field]: value };

    if (isPlainObject(field)) {
      data = field;
    }

    this.setState({ errors : Object.assign(this.state.errors, data) });
  }

  validateField(field) {
    switch (field) {
      case 'email':
        return this.validateEmail();
      case 'password':
      case 'confirm':
        return this.validatePassword(field);
      case 'username':
        return this.validateUsername();
    }
  }

  isNoErrors() {
    return !_.find(this.state.errors, _.identity);
  }
}
