import React, { Component } from "react";
import { Response } from "./messages/Response";
import UserMessage from "./messages/UserMessage";
import SocketConnection from "./SocketConnection";
import ChatInput from "./ChatInput";

async function getHistory(senderId) {
  return await (
    await fetch(process.env.REACT_APP_API_ENDPOINT + "history/" + senderId)
  ).json();
}

// The chat window, including the previous messages and the chat text input.
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      usable: false,
    };
    this.connection = new SocketConnection((x) => this.addBotMessage(x));
    this.chatEndRef = React.createRef();
    this.inputRef = React.createRef();
  }

  scrollDown() {
    // Ignore call while page is loading
    if (!this.chatEndRef) return;
    this.chatEndRef.current?.scrollIntoView();
  }

  addUserMessage(text) {
    this.setState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        <div
          className="align-self-end user-item"
          key={state.messages.length + 1}
        >
          <UserMessage text={text} />
        </div>,
      ],
    }));
    this.scrollDown();
  }

  /**
   * Adds 'message' as a bot response.
   */
  addBotMessage(message) {
    console.log(message);
    this.setState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        <Response
          key={state.messages.length + 1}
          action={message}
          sendMessageCallback={(value) => this.sendMessage(value)}
          senderId={this.connection.sessionId}
        />,
      ],
    }));
    this.scrollDown();
  }

  /**
   * Load the conversation history from the server via HTTP.
   * Overrides messages state to contain all historic messages.
   */
  async restoreConversationHistory() {
    this.setState((state) => ({
      ...state,
      usable: false,
    }));

    // TODO: implement
    const messages = (await getHistory(this.connection.sessionId)).body;

    console.log(messages);

    for (const message of messages) {
      if (message.event === "bot") this.addBotMessage(message);
      else if (message.event === "user") this.addUserMessage(message.text);
    }

    this.setState((state) => ({
      ...state,
      usable: true,
    }));

    this.inputRef.current.focusInput();
  }
  f;
  /**
   * Send 'value' as a message via the socketio connection.
   */

  sendMessage(value) {
    this.addUserMessage(value);
    this.connection.sendMessage(value);
  }

  componentDidMount() {
    this.restoreConversationHistory();
  }

  render() {
    const content = this.state.usable ? (
      <div className="container d-flex flex-column align-items-center">
        <div className="d-flex flex-column chat-window">
          {this.state.messages}
        </div>
        <div ref={this.chatEndRef} className="spacer">
          {/* This element is there to have some space on the bottom */}
        </div>
      </div>
    ) : (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

    return (
      <div>
        <div className="d-flex flex-column align-items-center">
          <h2 className="mv-4 mt-2">Chatbot</h2>
          <hr className="mb-4 separator" />
          {content}
          <div className="lower-half d-flex flex-column align-items-center justify-items start">
            <div className="container-md chat-input mt-1">
              <ChatInput
                ref={this.inputRef}
                disabled={!this.state.usable}
                onSubmit={(_e, value) => this.sendMessage(value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatWindow;
