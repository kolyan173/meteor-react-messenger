import React, { Component, PropTypes } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import MessagesList from '../../components/Messages/MessagesList.jsx';
import _ from 'lodash';
import {
  insert,
  remove,
  updateText
} from '../../../api/messages/methods.js';

const { array } = PropTypes;

export default class Home extends Component {
  static propTypes = {
    messages: array
  };

  constructor(props) {
    super(props);

    this.messageText = '';
    this.oldMessages = [];
  }

  state = {
    messageText: ''
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.messages && newProps.messages) {
      this.oldMessages = newProps.messages;
      console.log(this.oldMessages);
    }
  }

  handleSendMessage = (e) => {
    this.setState({ shake: true });

    setTimeout(() => {
      this.setState({ shake: false });
    }, 1e3);

    const content = this.refs.msgText.value;

    if (!content) { return; }

    const user = Meteor.user();

    insert.call({
      text: content,
      authorId: user._id,
      authorUsername: user.username || 'Anonymous'
    });

    this.refs.msgText.value = '';
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSendMessage();
    }
  }

  render() {
    const { messages } = this.props;
    const { messageText } = this;

    return (
      <div className="messages">
        <PageHeader title="Messenger"/>

        <MessagesList messages={messages} ref="mesgList"/>

        <div className="sending-block-wrapper">
          <div className="message-form">
            <div className="form-group">
              <input
                className={this.state.shake && 'shake'}
                onKeyPress={this.handleKeyPress}
                type="text"
                ref="msgText"
                autoFocus
                placeholder="Write a message..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
