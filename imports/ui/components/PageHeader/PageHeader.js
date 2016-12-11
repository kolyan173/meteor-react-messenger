import React, { PropTypes } from 'react';

const { string } = PropTypes;

const PageHeader = ({ title }) => {
  return (
    <div className="page-header">
      <h1>{title}</h1>
    </div>
  );
};

export default PageHeader;

PageHeader.propTypes = {
  title: string
};
