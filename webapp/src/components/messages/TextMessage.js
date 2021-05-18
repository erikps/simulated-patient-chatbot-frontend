import { React } from "react";

export function TextMessage(props) {
  return (
    <div className={"message-background px-2 py-1 " + props.className}>
      {props.text}
    </div>
  );
}

export default TextMessage;
