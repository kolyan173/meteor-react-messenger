import React, { Component, PropTypes } from 'react';

const { bool, string, func } = PropTypes;

export default class InlineEdit extends Component {
  static propTypes = {
    text: string,
    paramName: string,
    onChange: func,
    className: string,
    editing: bool
  };

  handleChange = (e) => {
    const { onChange, paramName } = this.props;

    this.props.onChange({ [paramName]: e.target.value });
  }

  render() {
    const {
      text,
      paramName,
      onChange,
      className,
      editing
    } = this.props;

    return editing
      ? <input
            defaultValue={text}
            ref={paramName}
            onChange={this.handleChange}
        />
      : <div className={className}>{text}</div>
  }
}
