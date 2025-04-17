import classes from "./Cards.module.css";
import { useState } from "react";

interface CardProps {
  card: CardSettings;
  // NOTE: can't pass this function in at card initialization (cant go in CardSettings)
  // pass it in normally as a prop so it uses the new version of state every time
  onClick: (i: number) => void;
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
  const { card, onClick } = props;

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
      }}
      onClick={() => clicked()}
    ></div>
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

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const clickCard = async (i: number) => {
    let newCards = cards.map((card, index) => {
      return index == i ? { ...card, isRevealed: true } : card;
    });
    setCards(newCards);
    let newSelected = [...selected, i];
    // if this is the first card clicked, then just reveal it
    if (newSelected.length === 2) {
      console.log("clicked second card");
      // if colors dont match, set them both to be unrevealed
      if (newCards[newSelected[0]].color !== newCards[newSelected[1]].color) {
        // sleep for 1 second
        await sleep(1000);
        console.log('slept')
        // make both selected cards unrevealed
        newCards = cards.map((card, index) => {
          return selected.includes(index) ? { ...card, isRevealed: false } : card;
        });
        setCards(newCards);
      }
      // unselect these cards
      newSelected = [];
    }
    setSelected(newSelected);
  };

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

  return (
    <div
      className={classes.container}
      style={{ gridTemplateColumns: "auto ".repeat(NUM_COLUMNS) }}
    >
      {cards.map((cardProp) => {
        return (
          <Card key={cardProp.index} card={cardProp} onClick={clickCard} />
        );
      })}
    </div>
  );
};

export default Cards;
