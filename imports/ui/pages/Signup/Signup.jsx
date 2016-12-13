import React, { Component } from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import Input from '../../components/FormElements/Input.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import _ from 'lodash';
import { capitalizeFirstLetter } from '../../utils.js';
import countriesList from 'country-list';
// import { UserFormHoc } from '../../HOCs/UserFormHoc.js';
import Form from '../../components/FormElements/Form.jsx';

export default class Signup extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.countries = countriesList().getNames()
      .map((item) => ({
        value: item.toLowerCase(),
        label: item
      })
    );
    //
    // this.fields = [
    //   'email',
    //   'password',
    //   'confirm'
    // ];
  }

  state = {
    location: '',
    isValid: false
  }

  submit = (data) => {
    const options = {
        email: data.email,
        password: data.password,
        profile: {
            location: data.location
        }
    };

    Accounts.createUser(options, (err) => {
      if (err) { return console.error(err); }

      this.context.router.push('/');
    });
  }

  onValid = (data) => {
    this.setState({ isValid: true });
    console.log(data);
  }

  onInvalid = (data) => {
    this.setState({ isValid: false });
  }

  handleFieldChange = (e) => {
    console.log(e.target.value);
  }

  render() {
    return (
      <div className="signup">
        <PageHeader title="Signup" />

        <Form
          onValidSubmit={this.submit}
          onValid={this.onValid}
          onInvalid={this.onInvalid}
          className="profile-form"
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
          <Input
            name="confirm"
            value={this.confirm || ''}
            type="password"
            validations={{
              equalsField: 'password',
              minLength: 6,
              maxLength: 12
            }}
            validationErrors={{
              minLength: 'Password is too shirt. Minimum is 6 characters',
              maxLength: '"Password is too long. Maximim is 12 characters',
              equalsField: 'Passwords mismatch'
            }}
            placeholder="Confirm password"
            required
          />
          <Input
            type="select"
            name="location"
            value={this.location || ''}
            validations={{
              isExisty: true
            }}
            validationErrors={{
              isExisty: 'Required field'
            }}
            options={this.countries}
            placeholder="Choose location"
            required
          />

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
            >
              Signup
            </button>
          </div>
        </Form>

        <div className="or-separator">
          <span>or</span>
          <Link to="/login" className="btn btn-default"> Login </Link>
        </div>
      </div>
    );
  }
}
