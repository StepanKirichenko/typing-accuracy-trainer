function randNumber(n) {
  return Math.floor(Math.random() * n);
}

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

function getNextRandomCharacter(directionalChain, bigram, position) {
  const stateString = `${bigram}-${position}`;
  const state = directionalChain[stateString];
  const transitions = state.transitions;
  const totalCount = state.totalCount;
  const rand = randNumber(totalCount);
  let acc = 0;
  for (const t of transitions) {
    acc += t.count;
    if (acc >= rand) {
      return t.character;
    }
  }
  return ' ';
}

function generateForwardFromBigramAtPosition(chain, bigram, initialPosition) {
  const res = [];
  let position = initialPosition;
  let previousCharacter = bigram[0];
  let currentCharacter = bigram[1];

  while (true) {
    const bigram = `${previousCharacter}${currentCharacter}`;
    const nextCharacter = getNextRandomCharacter(chain.forwardChain, bigram, position);
    if (nextCharacter === ' ') {
      return res.join('');
    }
    res.push(nextCharacter);
    previousCharacter = currentCharacter;
    currentCharacter = nextCharacter;
    position += 1;
  }
}

function generateBackwardFromBigramAtPosition(chain, bigram, initialPosition) {
  const res = [];
  let position = initialPosition;
  let previousCharacter = bigram[0];
  let currentCharacter = bigram[1];

  while (true) {
    const bigram = `${previousCharacter}${currentCharacter}`;
    const nextCharacter = getNextRandomCharacter(chain.backwardChain, bigram, position);
    if (nextCharacter === ' ') {
      return res.reverse().join('');
    }
    res.push(nextCharacter);
    currentCharacter = previousCharacter;
    previousCharacter = nextCharacter;
    position -= 1;
  }
}

export function generateWordFromChain(chain) {
  return generateForwardFromBigramAtPosition(chain, '  ', -1);
}

export function generateWordFromChainFromError(chain, errorBigram) {
  const bigramPositions = chain.bigramPositions[errorBigram];
  const errorPosition = bigramPositions[randNumber(bigramPositions.length)];
  const before = generateBackwardFromBigramAtPosition(chain, errorBigram, errorPosition);
  const after = generateForwardFromBigramAtPosition(chain, errorBigram, errorPosition);
  return `${before}${errorBigram}${after}`;
}