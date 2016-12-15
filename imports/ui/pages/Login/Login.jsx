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

  state = { validationErrors: {} }

  handleSubmit = ({ email, password }) => {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        if (err.message === 'User not found [403]') {
          this.setState({
            validationErrors: { email: err.reason }
          });
        } else if (err.message === 'Incorrect password [403]') {
          this.setState({
            validationErrors: { password: err.reason }
          });
        }

        this.shake();

        return console.error(err);
      }

      this.context.router.push('/');
    });
  }

  handleFieldChange = (field) => {
    if (['email', 'password'].includes(field)) {
      this.setState({
        validationErrors: {}
      });
    }
  }

  shake = () => {
    this.setState({ invalidSubmit: true });

    setTimeout(() => {
      this.setState({ invalidSubmit: false });
    }, 5e2);
  }

  handleInvalidSubmit = () => {
    this.shake();
  }

  render() {
    return (
      <div className="login">
        <PageHeader title="Login" />

        <Form
          onValidSubmit={this.handleSubmit}
          onInvalidSubmit={this.handleInvalidSubmit}
          onValid={this.handleValid}
          className="signin-form"
          validationErrors={this.state.validationErrors}
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
            onChange={this.handleFieldChange.bind(this, 'email')}
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
            onChange={this.handleFieldChange.bind(this, 'password')}
          />

          <div className="form-group">
            <button
              type="submit"
              className={`btn btn-primary btn-block ${this.state.invalidSubmit && 'shake'}`}
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
