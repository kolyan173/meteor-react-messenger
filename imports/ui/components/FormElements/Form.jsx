import React, { Component, PropTypes } from 'react';
import Formsy from 'formsy-react';

export default class ProfileContent extends Component {
  static propTypes = {
    isEditable: PropTypes.bool,
    reset: PropTypes.bool
  }

  static defaultProps = {
    isEditable: true
  }

  componentWillReceiveProps(newProps) {
    const { reset } = this.props;

    if (newProps.reset !== reset && reset) {
      this.refs.form.reset();
      this.props.onReset();
    }
  }

  render() {
    const { isEditable, children } = this.props;

    if ( isEditable ) {
      return <Formsy.Form {..._.omit(this.props, ['isEditable', 'reset', 'onReset'])}>
            {children}
          </Formsy.Form>
    }

    return <form>{children}</form>;
  }
}
