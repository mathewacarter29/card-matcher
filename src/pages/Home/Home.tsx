import { useState } from "react";
import Cards from "../Cards/Cards";
import classes from "./Home.module.css";

const Home = () => {
  const [start, setStart] = useState(false);
  const [difficulty, setDifficulty] = useState('easy')
  const startGame = (difficulty: string) => {
    setDifficulty(difficulty);
    setStart(true);
  };

  const returnHome = () => {
    setStart(false);
  }

  const Select = () => {
    return (
      <div>
        <h1>Memorizer</h1>
        <h2>Find all the matching pairs to win!</h2>
        <div
          className={classes.buttonContainer}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <button onClick={() => startGame('easy')}>Easy</button>
          <button onClick={() => startGame('medium')}>Medium</button>
          <button onClick={() => startGame('hard')}>Hard</button>
          <button onClick={() => startGame('expert')}>Expert</button>
        </div>
      </div>
    );
  };

  return <div>{start ? <Cards difficulty={difficulty} returnHome={() => returnHome()}/> : <Select />}</div>;
};

export default Home;
