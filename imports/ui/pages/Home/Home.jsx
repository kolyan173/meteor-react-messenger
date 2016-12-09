import React, { Component, PropTypes } from 'react';
import MessagesList from '../../components/Messages/MessagesList.jsx';
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
  }

  state = {
    messageText: ''
  }

  handleSendMessage = (e) => {
    e.preventDefault();

    const user = Meteor.user();
    const authorName = user.firstName && user.firstName && user.firstName + ' ' + user.lastName;

    insert.call({
      text: this.state.messageText,
      authorId: user._id,
      authorName
    });
  }

  handleType = (e) => {
    this.setState({ messageText: e.target.value });
  }

  render() {
    const { messages } = this.props;
    const { messageText } = this.state;

    return (
      <div className="messages">
        <MessagesList messages={messages} />

        <form
          className="message-form"
          onSubmit={this.handleSendMessage}
        >
          <div className="form-group">
            <input
              type="text"
              value={messageText}
              onChange={this.handleType}
              placeholder="Write a message..."
            />
          </div>
          <input
            type="submit"
            className="btn btn-success"
            value="Send"
          />
        </form>
      </div>
    );
  }
}
