import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import MessageItem from './MessageItem.jsx';

const { array } = PropTypes;

export default class MessagesList extends Component {
  static propTypes = {
    messages: array
  }

  constructor(props) {
    super(props);

    this.messages = [];
  }

  componentDidMount() {
    setTimeout(() => {
      const el = this.refs.msgList;

      el.scrollTop = el.scrollHeight;
    }, 500);
  }

  componentWillReceiveProps(newProps) {
    const { messages } = this.props;

    if (messages.length !== newProps.messages) {
      // this.mess
      // const newMessages = _.difference(newProps.messages, this.messages);
      // console.log(newProps.messages, this.messages);
      // this.messages = this.messages.concat(newMessages);

      const el = this.refs.msgList;
      el.scrollTop = el.scrollHeight;
    }
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps);
  }

  render() {
    return (
      <div className="messages-list" ref="msgList">
        {this.props.messages.map((item, index) => (
          <MessageItem
            key={index}
            authorId={item.authorId}
            time={item.createdAt}
            author={item.authorUsername}
            content={item.text}
          />
        ))}
      </div>
    );
  }
}
