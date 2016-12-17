import React, { Component, PropTypes } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import MessagesList from '../../components/Messages/MessagesList.jsx';
import messagesStore from '../../stores/messages';
import _ from 'lodash';
import {
  insert,
  remove,
  updateText
} from '../../../api/messages/methods.js';

const { array, number, bool } = PropTypes;

export default class Home extends Component {
  static propTypes = {
    messages: array,
    defaultMsgLimit: number,
    messagesLoaded: bool,
    hasMessagesMore: bool
  };

  constructor(props) {
    super(props);

    this.messageText = '';
    this.oldMessages = [];
  }

  state = {
    messageText: '',
    loading: false,
    initLoading: true,
    sendMessage: false
  }

  componentWillReceiveProps(newProps) {
    const { messages } = newProps;

    if (!_.isEqual(messages, this.props.messages)) {
      if (this.state.loading) {
        this.setState({ loading: false });
      }
    }
  }

  componentWillUnmount() {
    messagesStore.reset();
    $('.messages-list').off();
  }

  handleSendMessage = (e) => {
    const content = this.refs.msgText.value;

    if (!content) { return };

    this.setState({ shake: true, sendMessage: true });
    setTimeout(() => {
      this.setState({ shake: false, sendMessage: false });
    }, 1e3);

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
    const {
      messages,
      messagesLoaded,
      hasMessagesMore
    } = this.props;
    const { messageText } = this;
    console.log('render: Home');
    return (
      <div className="messages">
        <PageHeader title="Messenger"/>

        <MessagesList
          messages={messages}
          ref="msgList"
          loaded={messagesLoaded}
          sendMessage={this.state.sendMessage}
          hasMessagesMore={hasMessagesMore}
        />

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
