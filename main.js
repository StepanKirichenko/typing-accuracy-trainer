import { setChain, createExercise } from "./exercise";

let chain = {};
fetch('/chain.json')
  .then((response) => response.json())
  .then((json) => {
    chain = json;
    setChain(chain);
    createExercise();
  })

