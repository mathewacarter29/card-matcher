import classes from "./Cards.module.css";
import { useState } from "react";

interface CardSettings {
  height: string;
  width: string;
  index: number;
}

const Card = (props: CardSettings) => {
  const [isClicked, setIsClicked] = useState(false);
  const [color, setColor] = useState('gray');

  const clicked = () => {
    setIsClicked(true);
    setColor('red')
    console.log("clicked", props.index);
  };

  return (
    <div
      className={classes.card}
      style={{ height: props.height, width: props.width, backgroundColor: color }}
      onClick={() => clicked()}
    ></div>
  );
};

const Cards = () => {
  const NUM_CARDS = 20;
  const NUM_COLUMNS = 4;

  const initCards = () => {
    let init: CardSettings[] = [];
    for (let i = 0; i < NUM_CARDS; i++) {
      init.push({
        height: "100px",
        width: "70px",
        index: i
      });
    }
    return init;
  };

  const [cards, setCards] = useState(initCards());

  return (
    <div
      className={classes.container}
      style={{ gridTemplateColumns: "auto ".repeat(NUM_COLUMNS) }}
    >
      {cards.map((cardProp) => {
        return (
          <Card
            key={cardProp.index}
            index={cardProp.index}
            height={cardProp.height}
            width={cardProp.width}
          />
        );
      })}
    </div>
  );
};

export default Cards;
