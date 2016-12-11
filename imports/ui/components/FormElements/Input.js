import React, { PropTypes } from 'react';
import _ from 'lodash';

const { string } = PropTypes;

export const Input = (props) => {
  const errorStatus = _.isUndefined(props.error)
                    ? ''
                    :  _.isNull(props.error) && 'has-success' || 'has-error';

  return (
    <div className={`form-group ${errorStatus}`}>
      <input
        className='form-control'
        id={props.name}
        {..._.omit(props, ['error', 'validate', 'onError'])}
      />

      {props.error &&
        <span
          id={props.name}
          className="help-block">
          {props.error}
        </span>
      }
    </div>
  );
};

Input.propTypes = {
  type: string,
  name: string,
  placeholder: string,
  classname: string
};
