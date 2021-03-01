import { React, Component } from "react";
import cfg from "../config.json"

class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  async sendMessage(e, value) {
    let payload = {
      method: "POST",
      body: JSON.stringify({ text: value }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.setState((state, props) => ({
      messages: [...state.messages, value],
    }));
    
    // Get a response from chatbot api to the message entered by the user
    let json = await (await fetch(cfg.host, payload)).json();
    this.setState((state, props) => ({
      messages: [...state.messages, "intent: " + json.intent.name],
    }));
  }

  render() {
    const messages = this.state.messages.map((message, index) => (
      <li key={index}>{message}</li>
    ));
    return (
      <div>
        <div className="d-flex flex-column align-items-center">
          <h2 className="mv-4">Chatbot</h2>
          <hr className="mb-4" style={{ width: "40%" }} />
        </div>
        <div className="container w-50 d-flex flex-column justify-content-end h-100">
          <div className="d-flex flex-column align-items-center">
            <ul>{messages}</ul>
          </div>
          <div className="flex-shrink-1">
            <ChatInput onSubmit={(e, value) => this.sendMessage(e, value)} />
          </div>
        </div>
      </div>
    );
  }
}

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
