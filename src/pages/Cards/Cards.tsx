import classes from "./Cards.module.css";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface CardProps {
  card: CardSettings;
  // NOTE: can't pass this function in at card initialization (cant go in CardSettings)
  // pass it in normally as a prop so it uses the new version of state every time
  onClick: (i: number) => void;
  isSelected: boolean;
}

type CardSettings = {
  height: string;
  width: string;
  index: number;
  color: string;
  isRevealed: boolean;
};

const Card = (props: CardProps) => {
  const BACKGROUND_COLOR = "gray";
  const { card, onClick, isSelected } = props;

  const clicked = () => {
    onClick(card.index);
  };

  return (
    <div
      className={classes.card}
      style={{
        height: card.height,
        width: card.width,
        backgroundColor: card.isRevealed ? card.color : BACKGROUND_COLOR,
        opacity: isSelected ? "100%" : "40%",
      }}
      onClick={() => clicked()}
    ></div>
  );
};

type TimerSettings = {
  minutes: number;
  seconds: number;
  hours: number;
};

interface TimerProps {
  time: TimerSettings;
  count: number;
}

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

const Cards = () => {
  const NUM_CARDS = 20;
  const NUM_COLUMNS = 4;
  // length of this array should be half NUM_CARDS
  const COLORS = [
    "red",
    "blue",
    "orange",
    "yellow",
    "green",
    "maroon",
    "purple",
    "black",
    "turquoise",
    "pink",
  ];

  const {
    // totalSeconds,
    // milliseconds,
    seconds,
    minutes,
    hours,
    // days,
    // isRunning,
    start,
    pause,
    reset,
  } = useStopwatch();

  const initCards = () => {
    let init: CardSettings[] = [];
    let colorList = COLORS.concat(COLORS);
    for (let i = 0; i < NUM_CARDS; i++) {
      const colorIndex = Math.floor(Math.random() * colorList.length);
      init.push({
        height: "100px",
        width: "70px",
        index: i,
        color: colorList[colorIndex],
        isRevealed: false,
      });
      colorList.splice(colorIndex, 1);
    }
    return init;
  };

  const [cards, setCards] = useState<CardSettings[]>(() => initCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [isWinner, setIsWinner] = useState(false);

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const incrementCount = () => {
    setCount((prevCount) => (prevCount += 1));
  };

  const timeFormatter = (hours: number, minutes: number, seconds: number) => {
    return `${String(hours).padStart(2, "0")}h:${String(minutes).padStart(
      2,
      "0"
    )}m:${String(seconds).padStart(2, "0")}s`;
  };

  const clickCard = async (i: number) => {
    if (count === 0) {
      start();
    }
    let newCards = cards.map((card, index) => {
      return index == i ? { ...card, isRevealed: true } : card;
    });
    setCards(newCards);
    let newSelected = [...selected, i];
    setSelected(newSelected);
    // if this is the first card clicked, then just reveal it
    if (newSelected.length >= 2) {
      incrementCount();
      setLoading(true);
      // if colors dont match, set them both to be unrevealed
      // sleep for 1 second
      await sleep(1000);
      if (newCards[newSelected[0]].color !== newCards[newSelected[1]].color) {
        // make both selected cards unrevealed
        newCards = cards.map((card, index) => {
          return selected.includes(index)
            ? { ...card, isRevealed: false }
            : card;
        });
        setCards(newCards);
      } else {
        // cards are a match
        if (newCards.every((card) => card.isRevealed)) {
          // all cards are revealed, we have a winner!
          pause();
          setIsWinner(true);
        }
      }
      // unselect these cards
      newSelected = [];
    }
    setSelected(newSelected);
    setLoading(false);
  };

  const onRestart = () => {
    setLoading(true);
    setCards(initCards());
    setSelected([]);
    reset();
    setCount(0);
    setLoading(false);
  };

  return (
    <div className={classes.container}>
      <Dialog
        open={isWinner}
        onClose={() => setIsWinner(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">You're a winner!</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.timer}
          >
            <span>Turns taken: {count}</span>
            <br />
            <span>Time elapsed: </span>
            <span>{timeFormatter(hours, minutes, seconds)}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => {
              setIsWinner(false);
              onRestart();
              // TODO to go home screen
            }}
          >
            Home
          </button>
          <button
            onClick={() => {
              setIsWinner(false);
              onRestart();
            }}
            autoFocus
          >
            Play again
          </button>
        </DialogActions>
      </Dialog>
      <TimerCounter
        time={{
          hours,
          minutes,
          seconds,
        }}
        count={count}
      />
      <div
        className={classes.board}
        style={{
          gridTemplateColumns: "auto ".repeat(NUM_COLUMNS),
          pointerEvents: loading || isWinner ? "none" : "auto",
        }}
      >
        {cards.map((cardProp) => {
          return (
            <Card
              key={cardProp.index}
              card={cardProp}
              onClick={clickCard}
              isSelected={selected.includes(cardProp.index)}
            />
          );
        })}
      </div>
      <button onClick={() => onRestart()}>Go back</button>
    </div>
  );
};

export default Cards;
