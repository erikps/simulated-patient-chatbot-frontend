import InfoPage from "./InfoPage";

function DisclaimerPage(props) {
  const disclaimerText = (
    <>
      Please <b> do not enter any personal information </b> in your conversation
      with our chatbot. This is to protect your privacy. All answers you give
      will be stored on university servers. The resulting conversation history
      will be used to improve the performance of the chatbot.
      <br /> <br />
      After completing your conversation with our chatbot, we would like to
      invite you to take a survey that will help us improve. Your answers are
      anonymous and will be stored on university servers.
      <br />
      <br />
      <b>Thank you for helping us improve!</b>
    </>
  );

  return (
    <InfoPage
      title="Disclaimer"
      content={disclaimerText}
      nextText="ACCEPT"
      nextLink="/#instructions"
    />
  );
}

export default DisclaimerPage;
