import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { Decorator as FormsyElement } from 'formsy-react';
import Select from 'react-select';

const { string, func } = PropTypes;

@FormsyElement()
export default class Input extends Component {
  static propTypes = {
    type: string,
    name: string,
    placeholder: string,
    classname: string,
    onChange: func
  }

  static defaultProps = {
    editing: true,
    type: 'text'
  }

  handleChange = (e) => {
    this.props.setValue(e.target.value);
    this.props.onChange && this.props.onChange();
  }

  render() {
    const { props } = this;
    const {
      showError,
      name,
      defaultValue,
      isPristine,
      isValid,
      getErrorMessage,
      type,
      editing,
      options,
      placeholder
    } = props;
    const errorStatus = isPristine()
                        ? ''
                        : isValid() && 'has-success' || 'has-error';

    if (type === 'select') {
      return (
        <div className={`form-group ${errorStatus}`}>
          <Select
            options={options}
            clearable={false}
            disabled={!editing}
            className={name}
            id={name}
            name="location"
            value={this.props.getValue()}
            onChange={(data) => { this.props.setValue(data.value); }}
            placeholder={placeholder}
          />
        </div>
      );
    }
    return (
      <div className={`form-group ${errorStatus}`}>
        <input
          className={`form-control ${name}`}
          id={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          value={this.props.getValue()}
          onChange={this.handleChange}
          type={type}
        />

        {showError() &&
          <span
            id={name}
            className="help-block">
              {getErrorMessage()}
          </span>
        }
      </div>
    );
  }
}
