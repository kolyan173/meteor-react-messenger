import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import MessageItem from './MessageItem.jsx';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll.jsx';
import messagesStore from '../../stores/messages';

const { array } = PropTypes;

export default class MessagesList extends Component {
  static propTypes = {
    messages: array
  }

  constructor(props) {
    super(props);
  }

  state = { shouldAttachInfiniteScroll: false }

  componentWillReceiveProps(newProps) {
    const { messages } = this.props;

    if (messages.length !== newProps.messages.length) {
      if (!messages.length) {
        setTimeout(() => {
          // const el = this.refs.msgList;
          // el.scrollTop = el.scrollHeight;
        }, 100);
      }

      this.setState({ shouldAttachInfiniteScroll: true });
    }
  }

  componentDidUpdate() {
    // const el = this.refs.msgList;
    // el.scrollTop = el.scrollHeight - this.state.scrollPosition - 1;
  }

  shouldComponentUpdate(newProps, newState) {
    return true;
    // return ! (_.isEqual(this.props, newProps) || _.isEqual(this.state, newState));
  }

  handleInfiniteLoad = (pageNumber) => {
    const el = this.refs.msgList;

    this.setState({
      shouldAttachInfiniteScroll: false
      // scrollPosition: el.scrollHeight
    });

    messagesStore.loadMore();
  }

  render() {
    return (
      <div className="messages-list" ref="msgList">
        <InfiniteScroll
          shouldAttachScroll={this.state.shouldAttachInfiniteScroll}
          loadMore={this.handleInfiniteLoad}
          basedElement={this.refs.msgList}
          isReverse
          initialLoad={!this.props.loaded}
          loaded={this.props.loaded}
        >
          {this.props.messages.map((item, index) => (
            <MessageItem
              key={index}
              _key={index === (this.props.messages.length -1) && index}
              authorId={item.authorId}
              time={item.createdAt}
              author={item.authorUsername}
              content={item.text}
              threshold={10}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}
