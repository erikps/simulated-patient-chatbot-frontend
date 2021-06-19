import { io } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

/**
 * Handles all SocketIO communication with the RASA backend.
 */
class SocketConnection {
  #onMessageReceived;
  #client;

  sessionId;

  constructor(onMessageReceived) {
    // If no value for the sessionId is provided, generate a random uuid.

    let sessionId = localStorage.getItem("senderId");
    if (!sessionId) {
      sessionId = uuidV4();
      localStorage.setItem("senderId", sessionId);
    }

    this.sessionId = sessionId;

    this.#onMessageReceived = onMessageReceived;
    this.#client = io(process.env.REACT_APP_SOCKETIO_ENDPOINT);

    // Establish a session using the provided session id.
    // This is required, because session persistance is true in credentials.yml.
    this.#client.emit("session_request", { session_id: sessionId });

    // 'bot_uttered' is the event name specified for bot actions in credentials.yml.
    this.#client.on("bot_uttered", this.#onMessageReceived);

  }

  sendMessage(message) {
    // 'user_uttered' is the event name specified for user utterances in credentials.yml.
    this.#client.emit("user_uttered", { message, session_id: this.sessionId });
  }
}

export default SocketConnection;
