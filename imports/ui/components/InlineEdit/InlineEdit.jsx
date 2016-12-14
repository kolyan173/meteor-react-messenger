import React, { Component, PropTypes } from 'react';
import Input from '../../components/FormElements/Input.jsx';

export default class InlineEdit extends Component {
  render() {
    const { value, editing, className, label, placeholder, forceLabel } = this.props;

    return editing
      ? <Input {...this.props} />
      : <div className="form-group">
          <div className="form-control">
            {forceLabel || value || label}
          </div>
        </div>;
  }
}
