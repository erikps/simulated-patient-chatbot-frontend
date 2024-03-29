import React, { Component } from "react";
import { Response } from "./messages/Response";
import UserMessage from "./messages/UserMessage";
import SocketConnection from "./SocketConnection";
import ChatInput from "./ChatInput";
import Timer from "./Timer";
import ErrorPage from "./ErrorPage";

const MAX_TIME = 300000; // Maximum time of 5 minutes (given in seconds)
const CUTOFF_TIME = 3600000; // After 60 minutes negative, stop displaying the time (cover edge case)

/**
 * Retrieve conversation history (messages, reports) from the Flask HTTP api.
 */
async function getHistory(senderId) {
  return await (
    await fetch(process.env.REACT_APP_API_ENDPOINT + "history/" + senderId)
  ).json();
}

/**
 * The chat window, including the previous messages and the chat text input.
 */
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      usable: false,
      startDate: null,
      loadFailed: false,
    };

    this.connection = new SocketConnection((x) => this.addBotMessage(x));
    this.chatEndRef = React.createRef();
    this.inputRef = React.createRef();
  }

  /** Scroll down to the latest chat message. */
  scrollDown() {
    // Ignore call while page is loading
    if (!this.chatEndRef) return;
    this.chatEndRef.current?.scrollIntoView();
  }

  /** Add the string 'text' as user message to display it.
   *  Analogous to addBotMessage.
   */
  addUserMessage(text) {
    // Hide user messages that begin with a '/' i.e. messages that are interpreted as literal intents
    if (text.startsWith("/")) return;
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

  /** Adds 'message' as a bot response to display it.
   *  The message can be any valid response object stemming from the RASA chatbot, e.g. text, buttons, etc.
   *  Analogous to addUserMessage.
   */
  addBotMessage(message, isReportDisabled) {
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
          isReportDisabled={isReportDisabled}
        />,
      ],
    }));
    this.scrollDown();
  }

  /**
   * Load the conversation history from the server via HTTP.
   * Overrides messages state to contain all historic messages.
   * Additionally
   */
  async restoreConversationHistory() {
    // While restoring the conversation history the chat window should not be usable, i.e. grayed out.
    this.setState((state) => ({
      ...state,
      usable: false,
    }));

    // Retrieve conversation history for the session id.
    let res = undefined;
    try {
      res = await getHistory(this.connection.sessionId);
    } catch (error) {
      // If there is a connection error, set flag to display error page.
      this.setState((state) => ({
        ...state,
        loadFailed: true,
      }));
      return;
    }

    const body = res.body;
    const startTimestamp = body.start_timestamp * 1000; // Multiply by 1000 to
    const messages = body.messages;
    const reports = body.reports;

    // Add historic messages to the ui, differentiating between bot and user messages.
    for (const message of messages) {
      if (message.event === "bot")
        this.addBotMessage(message, reports.includes(message.timestamp));
      else if (message.event === "user") this.addUserMessage(message.text);
    }

    this.setState((state) => ({
      ...state,
      usable: true,
      startDate: startTimestamp,
    }));

    this.inputRef?.current?.focusInput();
  }

  /**
   * Send the string 'value' as a message via the socketio connection.
   */

  sendMessage(value) {
    this.addUserMessage(value);
    this.connection.sendMessage(value);
  }

  componentDidMount() {
    this.restoreConversationHistory();
  }

  render() {
    // In the case of repeated failure to connect, display an error page.
    if (this.state.loadFailed) {
      return <ErrorPage></ErrorPage>;
    }

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
        <div>
          <div className="d-flex fixed-top bg-white flex-column align-items-center">
            <h2 className="mv-4 mt-2">
              Conversation #{this.connection.sessionId.slice(0, 8)}
            </h2>
            <Timer
              startTime={this.state.startDate}
              maxTime={MAX_TIME}
              cutoff={CUTOFF_TIME}
            />
            <hr className="-mb-4 separator" />
          </div>
          <div style={{ height: "115px" }}></div>
          <div className="d-flex flex-column align-items-center">{content}</div>
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
