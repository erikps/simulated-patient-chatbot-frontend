import "./App.css";

import ChatWindow from "./components/ChatWindow";
import DisclaimerPage from "./components/DisclaimerPage";
import InstructionsPage from "./components/InstructionsPage";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/instructions">
          <InstructionsPage />
        </Route>

        <Route path="/conversation">
          <ChatWindow />
        </Route>

        <Route path="/">
          <DisclaimerPage />
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
