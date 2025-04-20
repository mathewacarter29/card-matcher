import { useState } from "react";
import Cards from "../Cards/Cards";
import classes from "./Home.module.css";

const Home = () => {
  const [start, setStart] = useState(false);
  const startGame = () => {
    setStart(true);
  };

  const Select = () => {
    return (
      <div>
        <h1>Memorizer</h1>
        <h2>Find all the matching pairs to win!</h2>
        <div
          className={classes.buttonContainer}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <button onClick={() => startGame()}>Easy</button>
          <button onClick={() => startGame()}>Medium</button>
          <button onClick={() => startGame()}>Hard</button>
          <button onClick={() => startGame()}>Expert</button>
        </div>
      </div>
    );
  };

  return <div>{start ? <Cards /> : <Select />}</div>;
};

export default Home;
