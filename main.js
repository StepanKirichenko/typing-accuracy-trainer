import { parseChain } from "./chain";
import { setChain, createExercise } from "./exercise";

fetch('/chain.json')
  .then((response) => response.json())
  .then((json) => {
    const chain = parseChain(json.chain);
    setChain(chain);
    createExercise();
  })

