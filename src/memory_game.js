const symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];

let winPopupMessage,
  container,
  gameBoard,
  startButton,
  restartButton,
  createBoard,
  startGameMessage;

let cards = [];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;

function setupDom(document) {
  winPopupMessage = document.querySelector(".win-popup-message");
  container = document.querySelector(".container");
  gameBoard = document.querySelector("#game-board");
  startButton = document.querySelector("#start-button");
  restartButton = document.querySelector("#restart-button");
  playAgainButton = document.querySelector("#play-again-button");
  startGameMessage = document.querySelector(".start-game-message");

  setStartButtonClickEvent();
  setRestartButtonClickEvent();
  setPlayAgainButtonClickEvent();

  createBoard = () => {
    if (!gameBoard) return;
    const cardSymbols = shuffle([...symbols, ...symbols]);
    cardSymbols.forEach((symbol) => {
      const newCard = document.createElement("div");
      newCard.classList.add("hidden", "card");
      newCard.dataset.symbol = symbol;
      newCard.addEventListener("click", () => {
        flipCard(newCard);
        displayRestartButton();
      });
      gameBoard.appendChild(newCard);
      cards.push(newCard);
      disableCards();
    });
  };
}

function setStartButtonClickEvent() {
  startButton.addEventListener("click", () => {
    enableCards();
    startGameMessage.style.display = "none";
    container.classList.add("fully-bright-container");
  });
}

function setRestartButtonClickEvent() {
  restartButton.addEventListener("click", () => {
    startGame();
    startGameMessage.style.display = "block";
    container.classList.remove("fully-bright-container");
    restartButton.style.display = "none";
  });
}

function setPlayAgainButtonClickEvent() {
  playAgainButton.addEventListener("click", () => {
    startGame();
    winPopupMessage.style.display = "none";
    startGameMessage.style.display = "block";
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function disableCards() {
  cards.forEach((card) => {
    card.classList.add("disabled");
  });
}

function enableCards() {
  cards.forEach((card) => {
    card.classList.remove("disabled");
  });
}

function flipCard(card) {
  if (card.classList.contains("matched") || card === firstCard || secondCard) {
    return;
  }
  card.classList.remove("hidden");
  card.textContent = card.dataset.symbol;

  if (!firstCard) {
    firstCard = card;
  } else if (!secondCard) {
    secondCard = card;
    checkMatch();
  }
}

function displayRestartButton() {
  if (
    restartButton.style.display !== "block" &&
    matchedPairs !== symbols.length
  ) {
    restartButton.style.display = "block";
  }
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs += 1;
    displayWinMessage();
    resetFlippedCards();
  } else {
    setTimeout(() => {
      firstCard.classList.add("hidden");
      secondCard.classList.add("hidden");
      firstCard.textContent = "";
      secondCard.textContent = "";
      resetFlippedCards();
    }, 1000);
  }
}

function displayWinMessage() {
  if (matchedPairs === symbols.length) {
    setTimeout(() => {
      restartButton.style.display = "none";
      winPopupMessage.style.display = "block";
      container.classList.remove("fully-bright-container");
    }, 500);
  }
}

function resetFlippedCards() {
  firstCard = null;
  secondCard = null;
}

function startGame() {
  gameBoard.innerHTML = "";
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  cards = [];
  createBoard();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupDom(document);
    createBoard();
  });
}

module.exports = { setupDom, startGame };
