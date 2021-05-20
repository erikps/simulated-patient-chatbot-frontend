import InfoPage from "./InfoPage";

function InstructionsPage(props) {
  const content = (
    <>
      You are a senior medical student attached to a GP surgery. The next
      patient is 40 years old and is presenting with low back pain. This is the
      first time you have met this patient, but you know from the records that
      they do not consult the practice often.
      <br /> <br />
      Please take a focussed history.
      <br />
      <br />
      <b>You have five minutes.</b>
    </>
  );

  return (
    <InfoPage
      title="Instructions"
      content={content}
      nextText="BEGIN"
      nextLink="/#conversation"
    />
  );
}

export default InstructionsPage;
