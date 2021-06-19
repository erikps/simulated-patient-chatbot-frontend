import React, { useEffect, useState } from "react";

function formatMillisecondsAsMinuteSeconds(milliseconds) {
  const rawSeconds = Math.abs(milliseconds / 1000); // Seconds, including full minutes
  const minutes = Math.floor(rawSeconds / 60);
  const seconds = Math.floor(rawSeconds % 60);

  const minus = milliseconds < 0 ? "-" : "";
  return `${minus}${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function Timer(props) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    function calculateTime() {
      if (!props.startTime) return null;
      const time = +props.startTime - +new Date() + props.maxTime;
      return time;
    }
    setTimeout(() => {
      setTimeLeft(calculateTime());
    }, 1000);
  }, [timeLeft, props.startTime, props.maxTime]);

  const stopped = timeLeft < -props.cutoff; // Has the clock stopped due to going over the cutoff time?

  const content =
    timeLeft && props.startTime ? (
      <>
        <b style={{ marginRight: ".25em" }}>
          {stopped
            ? "-" +
              formatMillisecondsAsMinuteSeconds(props.cutoff) +
              " (Stopped)"
            : formatMillisecondsAsMinuteSeconds(timeLeft)}
        </b>
      </>
    ) : (
      <>
        {/* Display this wile loading */}
        <b>--:--</b>
      </>
    );

  return (
    <div
      className="d-flex flex-inline"
      style={{
        backgroundColor: !timeLeft || timeLeft > 0 ? "lightgrey" : "#fc8b83",
        borderRadius: "1em",
        padding: "0em .5em",
      }}
    >
      {content}
    </div>
  );
}

export default Timer;
