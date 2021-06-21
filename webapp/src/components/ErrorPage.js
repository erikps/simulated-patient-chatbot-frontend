function ErrorPage(props) {
  const errorCode = props.errorCode ? props.errorCode.toString : "";

  return (
    <div className="container d-flex flex-column align-items-center">
      <h3 className="mt-4">Error {errorCode}</h3>

      <div>
        <p>
          Could not establish connection with server. <br />
          Please try to reload the page. If this does not work, try again at a
          later time.
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;
