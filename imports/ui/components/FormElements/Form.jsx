import React, { Component, PropTypes } from 'react';

export default class Form extends Component {
  render() {
    return (
      <form onSubmit={this.props.onSubmit} noValidate>
      </form>
    )
  }
}
