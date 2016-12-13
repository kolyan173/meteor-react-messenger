import React, { Component, PropTypes } from 'react';

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
    const { author, content, subMessages } = this.props;
    console.log('render');
    return (
      <div className="message-item panel panel-default">
        <h4 className="message-author panel-heading">
          {author}
        </h4>
        <div className="message-content panel-body">
          {content}
        </div>
         <ul className="list-group">
            {subMessages.map((item, i) => (
              <li className="list-group-item" key={i}>
                {item}
              </li>
            ))}
         </ul>
      </div>
    );
  }
}
