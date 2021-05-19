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
  const [timeLeft, setTimeLeft] = useState(props.maxTime);

  useEffect(() => {
    function calculateTime() {
      const time = +props.startTime - +new Date() + props.maxTime;
      return time;
    }
    setTimeout(() => {
      setTimeLeft(calculateTime());
    }, 1000);
  }, [timeLeft, props.startTime, props.maxTime]);

  return (
    <b
      style={{
        backgroundColor: timeLeft > 0 ? "lightgrey" : "#fc8b83",
        borderRadius: "1em",
        padding: "0em .5em",
      }}
    >
      {timeLeft < -props.cutoff ? "XX:XX": formatMillisecondsAsMinuteSeconds(timeLeft)}
    </b>
  );
}

export default Timer;
