import React, { Component, PropTypes } from 'react';
import Input from '../../components/FormElements/Input.jsx';

export default class InlineEdit extends Component {
  render() {
    const { value, editing, className } = this.props;

    return editing
      ? <Input {...this.props} />
      : <div className={className}>{value}</div>;
  }
}
