import { React, Component } from "react";

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
          disabled={this.props.disabled}
          placeholder="Aa"
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          autoFocus
        />
        <button
          disabled={this.props.disabled}
          className="btn btn-sm btn-outline-primary"
          type="submit"
        >
          <b>SEND</b>
        </button>
      </form>
    );
  }
}

export default ChatInput;
