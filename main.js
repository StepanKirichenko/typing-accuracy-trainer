import { setChain, createExercise } from "./exercise";

function parseChain(chainString) {
  const chain = {};
  const statesStrings = chainString.split(';'); 
  for (let stateString of statesStrings) {
    const [state, transitionsString] = stateString.split(':');
    const transitionsStrings = transitionsString.split(',');
    const transitions = transitionsStrings.map((s) => {
      const [character, countString] = s.split('-');
      return {
        character,
        count: Number(countString),
      };
    })
    chain[state] = transitions;
  }
  return chain;
}

fetch('/chain.json')
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
    const chain = parseChain(json.chain.forwardChain);
    setChain(chain);
    createExercise();
  })

