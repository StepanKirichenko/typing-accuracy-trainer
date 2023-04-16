export function parseChain(chainJson) {
  const forwardChainString = chainJson.forwardChain;
  const backwardChainString = chainJson.backwardChain;
  const bigramPositionsString = chainJson.bigramPositions;

  const forwardChain = parseChainTransitions(forwardChainString);
  const backwardChain = parseChainTransitions(backwardChainString);
  const bigramPositions = parseBigramPositions(bigramPositionsString);

  return {
    forwardChain,
    backwardChain,
    bigramPositions,
  }
}

function parseChainTransitions(chainString) {
  const chain = {};
  const statesStrings = chainString.split(';'); 
  for (let stateString of statesStrings) {
    const [state, transitionsString, totalCountString] = stateString.split(':');
    const transitionsStrings = transitionsString.split(',');
    const transitions = transitionsStrings.map((s) => {
      const [character, countString] = s.split('-');
      return {
        character,
        count: Number(countString),
      };
    })
    const totalCount = Number(totalCountString);
    chain[state] = {
      transitions,
      totalCount,
    }
  }
  return chain;
}

function parseBigramPositions(bigramPositionsString) {
  const bigrams = bigramPositionsString.split(';');
  const bigramPositions = {};
  for (let bigramString of bigrams) {
    const [bigram, positionsString] = bigramString.split(':');  
    const positions = positionsString.split(' ').map((p) => Number(p));
    bigramPositions[bigram] = positions;
  }
  return bigramPositions;
}