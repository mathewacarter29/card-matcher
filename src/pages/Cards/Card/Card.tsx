import classes from './Card.module.css';

interface CardProps {
  card: CardSettings;
  // NOTE: can't pass this function in at card initialization (cant go in CardSettings)
  // pass it in normally as a prop so it uses the new version of state every time
  onClick: (i: number) => void;
  isSelected: boolean;
}

export type CardSettings = {
  height: string;
  width: string;
  index: number;
  color: string;
  isRevealed: boolean;
};

/**
 * One single card on the board
 * @param props info for styling of the card
 * @returns One color card
 */
export const Card = (props: CardProps) => {
  const BACKGROUND_COLOR = "gray";
  const { card, onClick, isSelected } = props;

  const clicked = () => {
    if (!card.isRevealed) {
      onClick(card.index);
    }
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
