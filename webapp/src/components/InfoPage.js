import { Link } from "react-router-dom";
import "./InfoPage.css";

function InfoPage(props) {
  return (
    <div className="container info-page d-flex align-items-center flex-column pt-2">
      <h1 className="pb-2">{props.title}</h1>
      <p className="pb-2">{props.content}</p>
      <Link
        to={props.nextLink}
        className="btn btn-outline-primary rounded-pill"
      >
        <b>{props.nextText}</b>
      </Link>
    </div>
  );
}

export default InfoPage;
