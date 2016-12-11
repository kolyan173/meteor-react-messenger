import React, { Component, PropTypes } from 'react';
import { Input } from '../../components/FormElements/Input.js';
import _ from 'lodash';

const { bool, string, func } = PropTypes;

export default class InlineEdit extends Component {
  static propTypes = {
    text: string,
    paramName: string,
    onChange: func,
    className: string,
    editing: bool
  };

  // handleChange = (e) => {
  //   const { onChange, paramName } = this.props;
  //
  //   this.props.onChange({ [paramName]: e.target.value });
  // }

  render() {
    const {
      text,
      paramName,
      onChange,
      className,
      editing,
      fieldError
    } = this.props;

    return editing
      ? <Input
            defaultValue={text}
            // ref={paramName}
            // onChange={this.handleChange}

            error={fieldError(paramName)}
            type={paramName}
            name={paramName}
            noValidate
            {..._.omit(this.props, ['paramName', 'text', 'editing', 'fieldError'])}
        />
      : <div className={className}>{text}</div>
  }
}
