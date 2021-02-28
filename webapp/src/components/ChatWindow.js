import { React, Component } from "react";

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
    let json = await (await fetch("/api/", payload)).json();
    this.setState((state, props) => ({
      messages: [...state.messages, "msg: " + json.intent.name],
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
        <div className="container w-50">
          <div className="d-flex flex-column align-items-center">
            <ul>{messages}</ul>
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
