import { React, Component } from "react";

export class TextMessage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"message-background rounded-pill px-2 py-1 m-1 " + this.props.className}>
        {this.props.text}
      </div>
    );
  }
}

export default TextMessage;
