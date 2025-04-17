import classes from "./Cards.module.css";
import { useState } from "react";

interface CardProps {
  card: CardSettings;
}

type CardSettings = {
  height: string;
  width: string;
  index: number;
  color: string;
  onClick: () => void;
};

const Card = (props: CardProps) => {
  const { card } = props;
  const [color, setColor] = useState("gray");

  const clicked = () => {
    setColor(card.color);
    card.onClick();
  };

  return (
    <div
      className={classes.card}
      style={{ height: card.height, width: card.width, backgroundColor: color }}
      onClick={() => clicked()}
    ></div>
  );
};

const Cards = () => {
  const NUM_CARDS = 20;
  const NUM_COLUMNS = 4;
  // length of this array should be half NUM_CARDS
  const COLORS = ["red", "blue", "orange", "yellow", "green", "maroon", "purple", "black", "turquoise", "pink"];

  const clickCard = (i: number) => {
    console.log('clicked', i);
  }

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
        onClick: () => clickCard(i)
      });
      colorList.splice(colorIndex, 1);
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
        return <Card key={cardProp.index} card={cardProp} />;
      })}
    </div>
  );
};

export default Cards;
