import React, { Component, PropTypes } from 'react';
import moment from 'moment';

const { string, number, array } = PropTypes;

export default class MessageItem extends Component {
  static propTypes = {
    author: string,
    content: string,
    subMessages: array
  }

  static defaultProps = {
    subMessages: []
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { author, content, time, authorId } = this.props;
    const isMine = authorId === Meteor.userId();

    return (
      <div className={`message-item ${isMine && 'mine'}`}>
        <strong>{author}</strong>:
        <span className="message-content">
          {content}
        </span>
        <span className="pull-right">
          {moment(time).format('HH:mm')}
        </span>
      </div>
    );
  }
}
