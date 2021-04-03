import { React, Component } from "react";
import { parseResponse } from "./messages/Response";
import socketIoClient from "socket.io-client";
import UserMessage from "./messages/UserMessage";
import SocketConnection from "./SocketConnection";

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

async function sendMessage(message) {
  const payload = {
    method: "POST",
    body: JSON.stringify({ message, sender: "test_user" }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await (await fetch(ENDPOINT + "api", payload)).json();
}

// The chat window, including the previous messages and the chat text input.
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.connection = new SocketConnection(
      (x) => this.addBotMessage(x),
      "test_sender"
    );
  }

  addUserMessage(text) {
    this.setState((state, props) => ({
      messages: [
        ...state.messages,
        <div className="align-self-end">
          <UserMessage text={text} key={state.messageCount} />
        </div>,
      ],
    }));
  }

  addBotMessage(message) {
    console.log(message);
    this.setState((state, props) => ({
      messages: [
        ...state.messages,
        parseResponse(message, (value) => this.sendMessage(value)),
      ],
    }));
  }

  async sendMessage(value) {
    // Send the provided method and also
    this.addUserMessage(value);

    this.connection.sendMessage(value);
    // let result = await sendMessage(value);
    // this.addBotMessage(result);
  }

  render() {
    return (
      <div>
        <div className="d-flex flex-column align-items-center">
          <h2 className="mv-4 mt-2">Chatbot</h2>
          <hr className="mb-4 separator" />
        </div>
        <div className="container d-flex flex-column align-items-center">
          <div className="d-flex flex-column chat-window">
            {this.state.messages}
          </div>
          <div className="spacer">
            {/* This element is there to have some space on the bottom */}
          </div>
          <div className="lower-half d-flex flex-column align-items-center justify-items start">
            <div className="container-md chat-input mt-1">
              <ChatInput onSubmit={(_e, value) => this.sendMessage(value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// This component represents the chat input where the user can type messages.
class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    }
  }

  handleSubmit(event) {
    if (!this.state.value);
    else if (this.props.onSubmit) {
      // alert("Type something")
      this.props.onSubmit(event, this.state.value);
    }
    this.setState({ value: "" });
    event.preventDefault();
  }

  render() {
    return (
      <form className="d-flex" onSubmit={this.handleSubmit}>
        <input
          className="mx-1"
          placeholder="Aa"
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          autoFocus
        />
        <button className="btn btn-sm btn-outline-primary" type="submit">
          <b>SEND</b>
        </button>
      </form>
    );
  }
}

export default ChatWindow;
