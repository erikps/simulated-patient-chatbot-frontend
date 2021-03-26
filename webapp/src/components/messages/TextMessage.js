import { React, Component } from "react";

export class TextMessage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"message-background " + this.props.className}>
        {this.props.text}
      </div>
    );
  }
}

export default TextMessage;
