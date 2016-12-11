import React, { PropTypes } from 'react';

const { string } = PropTypes;

export const Input = (props) => {
  return (
    <div className={`form-group ${props.error && 'has-error'}`}>
      <input
        className='form-control'
        onBlur={handleBlur}
        {..._.omit(props, ['error', 'validate', 'onError'])}
      />
    </div>
  );

  function handleBlur() {
    const { name } = props;
    const errorMessage = props.validate(name);

    if (errorMessage) {
      props.onError({ [name]: errorMessage });
    }
  }
};

Input.propTypes = {
  type: string,
  name: string,
  placeholder: string,
  classname: string,
  fieldError: string
};
