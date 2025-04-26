import classes from "./Cards.module.css";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TimerCounter from "./TimerCounter/TimerCounter";
import { Card, CardSettings } from "./Card/Card";

/**
 * Component for header of game board
 * @param props contain timer info and count info
 * @returns turn counter and timer
 */

interface GameProps {
  difficulty: string;
  returnHome: () => void;
}

const Cards = (props: GameProps) => {
  const { difficulty, returnHome } = props;
  const setGameParams = (level: string): [number, number] => {
    switch (level) {
      case "easy":
        return [12, 4];
      case "medium":
        return [20, 5];
      case "hard":
        return [30, 6];
      case "expert":
        return [30, 6];
      default:
        console.log("unknown difficulty level");
        return [20, 5];
    }
  };
  const [NUM_CARDS, NUM_COLUMNS] = setGameParams(difficulty);
  // length of this array should be half NUM_CARDS
  const COLORS = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple", // easy
    "black",
    "cyan",
    "white",
    "magenta", // medium
    "maroon",
    "chocolate",
    "navy",
    "olive",
    "lime", // hard and expert
  ].slice(0, NUM_CARDS / 2);
  const IS_EXPERT = difficulty === "expert";

  const { seconds, minutes, hours, start, pause, reset } = useStopwatch();

  /**
   * Initialize cards on the board
   * @returns cards on initial game board with randomized colors and all not revealed
   */
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

  /**
   * Helper function for card clicker function
   * @param ms number of milliseconds to sleep for
   * @returns a promise you can await to wait for the given number of milliseconds
   */
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  /**
   * Increase the number of turns taken by 1
   */
  const incrementCount = () => {
    setCount((prevCount) => (prevCount += 1));
  };

  /**
   * Format the time for the winner's dialog box
   * @param hours number of hours it took to complete puzzle
   * @param minutes number of minutes it took to complete puzzle
   * @param seconds number of seconds it took to complete puzzle
   * @returns a string representation of the time
   */
  const timeFormatter = (hours: number, minutes: number, seconds: number) => {
    const hourText = hours
      ? `${String(hours)} hour${hours > 1 ? "s" : ""}, `
      : "";
    const minuteText =
      hours || minutes
        ? `${String(minutes)} minute${minutes > 1 ? "s" : ""}, `
        : "";
    const secondsText = `${String(seconds)} seconds`;
    return `${hourText}${minuteText}${secondsText}`;
  };

  /**
   * What happens when a card is clicked
   * 1. Flip it over
   * 2. Check if its a match
   * 3. Check if the game is over
   * @param i index of what card was clicked
   */
  const clickCard = async (i: number) => {
    if (count === 0) {
      start();
    }
    let newCards = cards.map((card, index) => {
      return index == i ? { ...card, isRevealed: true } : card;
    });
    setCards(newCards); // reveal the newly clicked card
    let newSelected = [...selected, i];
    setSelected(newSelected);
    if (newSelected.length >= 2) {
      incrementCount();
      setLoading(true);
      if (newCards[newSelected[0]].color !== newCards[newSelected[1]].color) {
        // cards are not the same
        // sleep for 1 second
        await sleep(1000);
        // make both selected cards unrevealed
        newCards = newCards.map((card, index) => {
          return newSelected.includes(index)
            ? { ...card, isRevealed: false }
            : card;
        });
        if (IS_EXPERT) {
          // if expert mode, turn over ALL cards upon wrong pair
          newCards = newCards.map((card) => {
            return card.isRevealed ? { ...card, isRevealed: false } : card;
          });
        }
        setCards(newCards);
      } else {
        // cards are a match
        if (newCards.every((card) => card.isRevealed)) {
          // all cards are revealed, we have a winner!
          pause();
          setIsWinner(true);
        } else {
          // if they match but its not a winner, still sleep. we dont want to sleep when we win
          // sleep for 1 second
          if (!IS_EXPERT) {
            await sleep(1000);
          }
        }
      }
      // unselect these cards
      newSelected = [];
    }
    setSelected(newSelected);
    setLoading(false);
  };

  /**
   * Restart the game
   */
  const onRestart = () => {
    setLoading(true);
    setIsWinner(false);
    setCards(initCards());
    setSelected([]);
    reset();
    setCount(0);
    setLoading(false);
  };

  const goHome = () => {
    returnHome();
  };

  return (
    <div className={classes.container}>
      <Dialog
        open={isWinner}
        onClose={() => setIsWinner(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.timer}
      >
        <DialogTitle id="alert-dialog-title">
          <span>You're a winner!</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>Turns taken: {count}</span>
            <br />
            <span>Time elapsed: </span>
            <span>{timeFormatter(hours, minutes, seconds)}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => {
              goHome();
            }}
          >
            Home
          </button>
          <button
            onClick={() => {
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
      <div
        style={{
          width: "30%",
          margin: "auto",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <button onClick={() => goHome()}>Go Back</button>
        <button onClick={() => onRestart()}>Restart</button>
      </div>
    </div>
  );
};

export default Cards;
