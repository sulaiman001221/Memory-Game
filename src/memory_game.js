const setupDom = (document) => {
  const symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
  const winPopupMessage = document.querySelector(".win-popup-message");
  const container = document.querySelector(".container");
  let gameBoard = document.querySelector("#game-board");
  let startButton = document.querySelector("#start-button");
  let gameStarted = false;
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let matchedPairs = 0;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createBoard() {
    const cardSymbols = shuffle([...symbols, ...symbols]);
    cardSymbols.forEach((symbol) => {
      let card = document.createElement("div");
      card.classList.add("hidden", "card");
      card.dataset.symbol = symbol;
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
      cards.push(card);
    });
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
    if (!gameStarted) return;
    if (
      card.classList.contains("matched") ||
      card === firstCard ||
      secondCard
    ) {
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

  function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matchedPairs += 1;
      if (matchedPairs === symbols.length) {
        setTimeout(() => {
          displayWinMessage();
        }, 1000);
      }
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
    winPopupMessage.style.display = "block";
    container.classList.remove("fully-bright-container");
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

  startButton.addEventListener("click", () => {
    gameStarted = true;
    createBoard();
    enableCards();
    document.querySelector(".start-game-message").style.display = "none";
    container.classList.add("fully-bright-container");
  });

  document.querySelector("#play-again-button").addEventListener("click", () => {
    startGame();
    winPopupMessage.style.display = "none";
    container.classList.add("fully-bright-container");
  });
  createBoard();
  disableCards();
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupDom(document);
  });
}

module.exports = { setupDom };
