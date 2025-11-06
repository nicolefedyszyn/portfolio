

let wordList = [
  "study",
  "react",
  "maple",
  "phone",
  "cloud",
  "beach",
  "house",
  "brain",
  "light",
  "music",
  "dance",
  "sport",
  "happy",
  "night",
  "dream",
];

// Function to get a random word from the list
const getRandomWord = () => {
  return wordList[Math.floor(Math.random() * wordList.length)];
};

let correctWord = getRandomWord();
let guesses = [];

let wordleForm = document.querySelector("#wordle-form");
let congratsElement = document.querySelector(".wordle-success");

wordleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let guessElement = event.target.elements["guess"];
  let guessValue = guessElement.value;

  let isValid = true;

  if (guessValue.trim().length !== 5) {
    isValid = false;
    guessElement.classList.add("is-invalid");
  } else {
    guessElement.classList.remove("is-invalid");
  }

  if (isValid) {
    addGuess(guessValue);
    showGuessOnPage();

    revealIfCorrect();
  }
  guessElement.value = "";
});

const addGuess = (guess) => {
  guesses.push(guess);
  console.log("Guesses: ", guesses);
};

//charachter is the letter we are checking, index is its location in the word
const isCharacterInCorrectPlace = (character, index) => {
  if (correctWord.toLowerCase()[index] === character.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};
//simplified version: return corrctWord[index] === character;

const isCharacterInWord = (character) => {
  if (correctWord.toLowerCase().includes(character.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

//simplified: return correctWord.toLowerCase().includes(character.toLowerCase());

const showGuessOnPage = () => {
  //check if gueses are 0 and return early
  if (guesses.length === 0) {
    return;
  }

  //the full array lenth -1 because we start at 0
  let lastGuessIndex = guesses.length - 1;

  //get all character box elements
  let selector = `.guess-${lastGuessIndex} .guess-character`;
  let characterDivs = document.querySelectorAll(selector);

  characterDivs.forEach((element, idx) => {
    //element points to the box on the screen
    //idx is the index of that box in the row
    //put correct character in the box

    let lastGuess = guesses[lastGuessIndex];
    let letter = lastGuess[idx];
    element.innerText = letter;

    //check if character is in right place
    if (isCharacterInCorrectPlace(letter, idx)) {
      //add a correct letter and place class
      element.classList.add("correct-letter-placement");
      updateKeyboard(letter, "correct");
      //check if character is in word
      //add a correct word letter class
    } else if (isCharacterInWord(letter)) {
      element.classList.add("incorrect-letter-placement");
      updateKeyboard(letter, "in-word");
    } else {
      updateKeyboard(letter, "not-in-word");
    }
  });
};

const revealIfCorrect = () => {
  if (guesses.includes(correctWord)) {
    // Show success message
    congratsElement.classList.remove("hidden");

    // Wait 3 seconds, then start a new game
    setTimeout(() => {
      resetGame();
    }, 3000);
  } else if (guesses.length >= 6) {
    // Game over - show the correct word
    congratsElement.innerHTML = `Game Over! The word was: <strong>${correctWord.toUpperCase()}</strong>`;
    congratsElement.classList.remove("hidden");

    // Wait 4 seconds, then start a new game
    setTimeout(() => {
      congratsElement.innerHTML = "You did it!"; // Reset success message
      resetGame();
    }, 4000);
  }
};

const updateKeyboard = (letter, status) => {
  const key = document.querySelector(`[data-key="${letter.toLowerCase()}"]`);
  if (key) {
    // Remove existing classes
    key.classList.remove("correct-letter", "incorrect-letter", "not-in-word");

    // Add new class based on status
    if (status === "correct") {
      key.classList.add("correct-letter");
    } else if (status === "in-word") {
      key.classList.add("incorrect-letter");
    } else {
      key.classList.add("not-in-word");
    }
  }
};

// Function to reset keyboard colors
const resetKeyboard = () => {
  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.classList.remove("correct-letter", "incorrect-letter", "not-in-word");
  });
};

const resetGame = () => {
  // Clear all guesses
  guesses = [];

  // Get a new random word
  correctWord = getRandomWord();
  console.log("New word:", correctWord); // For testing - remove this later

  // Clear all the boxes on screen
  for (let i = 0; i < 6; i++) {
    let selector = `.guess-${i} .guess-character`;
    let characterDivs = document.querySelectorAll(selector);
    characterDivs.forEach((element) => {
      element.innerText = "";
      element.classList.remove(
        "correct-letter-placement",
        "incorrect-letter-placement"
      );
    });
  }

  // Hide the success message
  congratsElement.classList.add("hidden");

  resetKeyboard();
};
