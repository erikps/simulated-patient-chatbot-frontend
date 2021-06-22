import { React, Component } from "react";
import { TextMessage } from "./TextMessage";

export class UserMessage extends Component {
  render() {
    return <TextMessage className="user-message" text={this.props.text} />;
  }
}

export default UserMessage;
