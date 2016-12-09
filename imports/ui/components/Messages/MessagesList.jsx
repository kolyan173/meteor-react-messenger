import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

const { array } = PropTypes;

export default class MessagesList extends Component {
  static propTypes = {
    messages: array
  }

  static defaultProps = {
    messages: []
  }

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps);
  }

  render() {
    return (
      <div className="messages-list">
        {this.props.messages.map((item, index) => (
          <div className="message" key={index}>
            <div className="message-author">{item.authorName || 'Anonymous'}</div>
            <div className="message-text">{item.text}</div>
          </div>
        ))}
      </div>
    );
  }
}
