import classes from './TimerCounter.module.css';

interface TimerProps {
  time: TimerSettings;
  count: number;
}

type TimerSettings = {
  minutes: number;
  seconds: number;
  hours: number;
};

const TimerCounter = (props: TimerProps) => {
  const { time, count } = props;

  return (
    <div
      className={classes.timer}
      style={{ display: "flex", justifyContent: "space-around" }}
    >
      <div>
        <span>{count} turns taken</span>
      </div>
      <div>
        <span>Time elapsed - </span>
        <span>{String(time.hours).padStart(2, "0")}</span>:
        <span>{String(time.minutes).padStart(2, "0")}</span>:
        <span>{String(time.seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
};

export default TimerCounter;