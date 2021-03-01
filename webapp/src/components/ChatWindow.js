import { React, Component } from "react";
import cfg from "../config.json";

async function sendMessage(message) {
  const payload = {
    method: "POST",
    body: JSON.stringify({ message, sender: "test_user" }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await (await fetch(cfg.host, payload)).json();
}

class Message extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.action);
  }

  render() {
    let buttons = [];
    if (this.props.action.buttons) {
      buttons = this.props.action.buttons.map(({ payload, title }) => (
        <td>
          <button
            type="button"
            className="btn btn-primary btn-sm"
          >
            {title}
          </button>
        </td>
      ));
    }

    return (
      <tr
        className="w-100 pb-3"
        style={{
          backgroundColor: this.props.isUserMessage ? "white" : "lightgreen",
        }}
      >
        <td>{this.props.isUserMessage ? "user:\u2002" : "bot:\u2002"}</td>
        <td>{this.props.action.text}</td>
        {buttons}
      </tr>
    );
  }
}

// The chat window, including the previous messages and the chat text input.
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], messageCount: 0 };
  }

  async sendMessage(e, value) {
    this.setState((state, props) => ({
      messages: [
        ...state.messages,
        <Message
          action={{ text: value }}
          key={state.messageCount}
          isUserMessage={true}
        />,
      ],
      messageCount: (state.messageCount += 1),
    }));

    // Get a response from chatbot api to the message entered by the user.
    let result = await sendMessage(value);
    this.setState((state, props) => ({
      messages: [
        ...state.messages,
        ...result.body.map((action, index) => (
          <Message
            action={action}
            key={state.messageCount + index}
            isUserMessage={false}
          />
        )),
      ],
      messageCount: (state.messageCount += result.body.length),
    }));
  }

  render() {
    return (
      <div>
        <div className="d-flex flex-column align-items-center">
          <h2 className="mv-4">Chatbot</h2>
          <hr className="mb-4" style={{ width: "40%" }} />
        </div>
        <div className="container w-50 d-flex flex-column justify-content-end h-100">
          <div className="">
            <table className="w-100 table-fit">
              <tbody>{this.state.messages}</tbody>
            </table>
          </div>
          <div className="mt-4">
            <ChatInput onSubmit={(e, value) => this.sendMessage(e, value)} />
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
    if (this.props.onSubmit) {
      this.props.onSubmit(event, this.state.value);
    }
    this.setState({ value: "" });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="form-control"
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default ChatWindow;
