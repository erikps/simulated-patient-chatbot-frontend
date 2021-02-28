import "./App.css";

function App() {
  return (
    <div>
      <div className="d-flex flex-column align-items-center">
        <h2 className="mv-4">Chatbot</h2>
        <hr className="separator" className="mb-4" style={{ width: "40%" }} />
      </div>
      <div className="container w-50">
        <div className="d-flex flex-column align-items-center">
          <p className="">Placeholder Message</p>
          <input
            type="text"
            name="userMessage"
            className="form-control w-50"
            id=""
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;
