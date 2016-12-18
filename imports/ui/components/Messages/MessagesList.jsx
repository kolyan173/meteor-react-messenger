import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import MessageItem from './MessageItem.jsx';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll.jsx';
import messagesStore from '../../stores/messages';

const { array, bool } = PropTypes;

export default class MessagesList extends Component {
  static propTypes = {
    messages: array,
    sendMessage: bool,
    loaded: bool,
    hasMessagesMore: bool
  }

  constructor(props) {
    super(props);
  }

  state = {
    shouldAttachInfiniteScroll: false,
    blindPoint: false
  }

  lastMessage = []

  componentWillReceiveProps(newProps, newState) {
    if (newProps.loaded) {
      if (!this.state.shouldAttachInfiniteScroll) {
        this.setState({ shouldAttachInfiniteScroll: true });
      }

      const lastMessage = _.last(newProps.messages);
      const isNewMessage = _.result(lastMessage, '_id') !== _.result(this.lastMessage, '_id');

      const newMessageAuthorId = _.result(lastMessage, 'authorId');

      if (isNewMessage && this.state.blindPoint) {
        if (Meteor.userId() !== newMessageAuthorId) {
          if (this.state.blindPoint && !this.state.messageNotify) {
            this.setState({ messageNotify: true });
          }
        }
      }

      this.lastMessage = _.last(newProps.messages);
    }
  }

  shouldComponentUpdate(newProps, newState) {
    return this.props.loaded || newProps.loaded;
  }

  handleInfiniteLoad = () => {
    this.setState({ shouldAttachInfiniteScroll: false });
    messagesStore.loadMore();
  }

  handleBlindPoint = (value) => {
    const state = {};

    if (!value && this.state.messageNotify) {
      state.messageNotify = false;
    }

    state.blindPoint = value;

    this.setState(state);
  }

  render() {
    const {
      hasMessagesMore,
      loaded,
      sendMessage,
      messages
    } = this.props;

    return (
      <div className="messages-list" ref="msgList">
        <InfiniteScroll
          shouldAttachScroll={this.state.shouldAttachInfiniteScroll}
          loadMore={this.handleInfiniteLoad}
          basedElement={this.refs.msgList}
          isReverse
          loaded={loaded}
          hasMore={hasMessagesMore}
          detectBlindPoint={this.handleBlindPoint}
          threshold={100}
        >
          {messages.map((item, index) => (
            <MessageItem
              key={index}
              authorId={item.authorId}
              time={item.createdAt}
              author={item.authorUsername}
              content={item.text}
              id={item._id}
            />
          ))}
        </InfiniteScroll>

        {this.state.messageNotify &&
          <div className="message-notification-wrapper">
            <div className="message-notification fadein">New message</div>
          </div>
        }
      </div>
    );
  }
}
