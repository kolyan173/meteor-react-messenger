import React, { PropTypes } from 'react';

const { string } = PropTypes;


export const Input = (props) => {
  return (
    <div className="form-group">
      <input
        className="form-control"
        ref={props.name}
        {...props}
      />
    </div>
  );
};

Input.propTypes = {
  type: string,
  name: string,
  placeholder: string
};
