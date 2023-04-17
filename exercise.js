import { words } from "/words.js";
import { generateWordFromChain, generateWordFromChainFromError } from "./chain";
import { shuffle } from "./rand-utils";

let chain = {};
const exerciseHolder = document.querySelector("#exercise");
const inputElement = document.querySelector("#exercise-input");
const appElement = document.querySelector("#app");
appElement.addEventListener("click", () => inputElement.focus());

export function setChain(newChain) {
  chain = newChain;
}

function createLetterElement(letter, index) {
  const letterElement = document.createElement("span");
  letterElement.id = `l${index}`;
  letterElement.innerText = letter;
  letterElement.classList.add("letter");
  return letterElement;
}

function createEndOfWordElement(index) {
  const element = document.createElement("span");
  element.id = `l${index}`;
  element.innerHTML = "&nbsp;";
  element.classList.add("letter");
  return element;
}

function createWordElement(word, index, isLastWord = false) {
  const wordElement = document.createElement("p");
  wordElement.classList.add("word");
  wordElement.id = `w${index}`;
  [...word].forEach((letter, letterIndex) => {
    const letterElement = createLetterElement(letter, letterIndex);
    wordElement.appendChild(letterElement);
  });
  if (!isLastWord) {
    wordElement.appendChild(createEndOfWordElement(word.length));
  }
  return wordElement;
}

function createExerciseElement(words) {
  const exerciseElement = document.createElement("div");
  exerciseElement.classList.add("exercise");
  words.forEach((word, wordIndex) => {
    const isLastWord = wordIndex === words.length - 1;
    const wordElement = createWordElement(word, wordIndex, isLastWord);
    exerciseElement.appendChild(wordElement);
  });
  return exerciseElement;
}

function generateExercise(errors, length, mode = "randomized") {
  if (mode === "randomized") {
    const res = [];
    if (errors.length == 0) {
      for (let i = 0; i < length; i++) {
        res.push(generateWordFromChain(chain));
      }
    } else {
      const errorCount = errors.length;
      const wordsPerError = Math.max(Math.ceil(length / errorCount), 1);
      for (let i = 0; i < length; i++) {
        const error = errors[Math.floor(i / wordsPerError)];
        res.push(generateWordFromChainFromError(chain, error.text));
      }
    }
    return shuffle(res);
  }

  if (errors.length === 0) {
    const res = getRandomElements(words, length);
    return shuffle(res);
  }

  const errorCount = errors.length;
  const wordsPerError = Math.max(Math.ceil(length / errorCount), 1);

  const res = [];
  errors.forEach((error) => {
    if (res.length >= length) {
      return;
    }
    const filteredWords = words.filter((w) => w.includes(error.text));
    const selectedWords =
      filteredWords.length > wordsPerError
        ? getRandomElements(filteredWords, wordsPerError)
        : shuffle(filteredWords);
    res.push(...selectedWords);
  });

  if (res.length < length) {
    res.push(...getRandomElements(words, length - res.length));
  }

  return shuffle(res);
}

export function createExercise(prevErrors = []) {
  const exerciseWords = generateExercise(prevErrors, 20);
  const exerciseElement = createExerciseElement(exerciseWords);
  let errors = [];

  exerciseHolder.replaceChildren(exerciseElement);

  let wordIndex = 0;
  let letterIndex = 0;

  const getCurrentWord = () => exerciseWords[wordIndex];
  const getCurrentWordElement = () => document.querySelector(`#w${wordIndex}`);
  const getCurrentLetterElement = () =>
    getCurrentWordElement().querySelector(`#l${letterIndex}`);

  const isExerciseFinished = () => wordIndex === exerciseWords.length;
  const isWordFinished = () =>
    wordIndex === exerciseWords.length - 1
      ? letterIndex === getCurrentWord().length
      : letterIndex > getCurrentWord().length;

  const registerError = (wordIndex, letterIndex) => {
    const word = exerciseWords[wordIndex];
    if (letterIndex >= word.length) {
      return;
    }

    const text = word[letterIndex];

    const lastError = errors.length === 0 ? null : errors[errors.length - 1];
    if (
      lastError &&
      lastError.word === wordIndex &&
      lastError.end === letterIndex - 1
    ) {
      lastError.text = lastError.text + text;
      lastError.end = letterIndex;
      return;
    }

    errors.push({
      text,
      word: wordIndex,
      start: letterIndex,
      end: letterIndex,
    });
  };

  const getErrorContext = (error) => {
    const word = exerciseWords[error.word];
    const letter = word[error.start];
    const before = error.start > 0 ? word[error.start - 1] : " ";
    const after = error.start + 1 < word.length ? word[error.start + 1] : " ";
    return {
      text: letter,
      context: before + letter + after,
    };
  };

  const getAnalyzedErrors = () => {
    const res = [];

    for (const error of errors) {
      const context = getErrorContext(error).context;
      if (context.length >= 2) {
        res.push({
          text: getErrorContext(error).context.slice(0, 2),
        });
      }
    }

    return res;
  };

  function handleInput(e) {
    const currentLetterElement = getCurrentLetterElement();
    currentLetterElement?.classList.remove("letter--current");

    const inputLetter = e.target.value;
    e.target.value = "";

    if (
      currentLetterElement.innerText === inputLetter ||
      (currentLetterElement.innerHTML === "&nbsp;" && inputLetter === " ")
    ) {
      currentLetterElement.classList.add("letter--correct");
    } else {
      registerError(wordIndex, letterIndex);
      currentLetterElement.classList.add("letter--incorrect");
    }

    letterIndex++;
    if (isWordFinished()) {
      wordIndex++;
      letterIndex = 0;
    }

    if (isExerciseFinished()) {
      inputElement.removeEventListener("input", handleInput);
      createExercise(getAnalyzedErrors());
      return;
    }

    getCurrentLetterElement().classList.add("letter--current");
  }

  inputElement.addEventListener("input", handleInput);
  inputElement.focus();
  getCurrentLetterElement().classList.add("letter--current");
}
