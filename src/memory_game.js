const symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];

class MemoryGame {
  constructor(document) {
    this.document = document;
    this.winPopupMessage = null;
    this.container = null;
    this.gameBoard = null;
    this.startButton = null;
    this.restartButton = null;
    this.playAgainButton = null;
    this.startGameMessage = null;
    this.cards = [];
    this.firstCard = null;
    this.secondCard = null;
    this.matchedPairs = 0;

    this.setupDom();
  }

  setupDom() {
    this.winPopupMessage = this.document.querySelector(".win-popup-message");
    this.container = this.document.querySelector(".container");
    this.gameBoard = this.document.querySelector("#game-board");
    this.startButton = this.document.querySelector("#start-button");
    this.restartButton = this.document.querySelector("#restart-button");
    this.playAgainButton = this.document.querySelector("#play-again-button");
    this.startGameMessage = this.document.querySelector(".start-game-message");

    this.setStartButtonClickEvent();
    this.setRestartButtonClickEvent();
    this.setPlayAgainButtonClickEvent();

    this.createBoard();
  }

  createBoard() {
    if (!this.gameBoard) return;

    const cardSymbols = this.shuffle([...symbols, ...symbols]);
    cardSymbols.forEach((symbol) => {
      const newCard = this.document.createElement("div");
      newCard.classList.add("hidden", "card");
      newCard.dataset.symbol = symbol;
      newCard.addEventListener("click", () => {
        this.flipCard(newCard);
        this.displayRestartButton();
      });
      this.gameBoard.appendChild(newCard);
      this.cards.push(newCard);
    });
    this.disableCards();
  }

  setStartButtonClickEvent() {
    this.startButton.addEventListener("click", () => {
      this.enableCards();
      this.startGameMessage.style.display = "none";
      this.container.classList.add("fully-bright-container");
    });
  }

  setRestartButtonClickEvent() {
    this.restartButton.addEventListener("click", () => {
      this.startGame();
      this.startGameMessage.style.display = "block";
      this.container.classList.remove("fully-bright-container");
      this.restartButton.style.display = "none";
    });
  }

  setPlayAgainButtonClickEvent() {
    this.playAgainButton.addEventListener("click", () => {
      this.startGame();
      this.winPopupMessage.style.display = "none";
      this.startGameMessage.style.display = "block";
    });
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  disableCards() {
    this.cards.forEach((card) => {
      card.classList.add("disabled");
    });
  }

  enableCards() {
    this.cards.forEach((card) => {
      card.classList.remove("disabled");
    });
  }

  flipCard(card) {
    if (
      card.classList.contains("matched") ||
      card === this.firstCard ||
      this.secondCard
    ) {
      return;
    }
    card.classList.remove("hidden");
    card.textContent = card.dataset.symbol;

    if (!this.firstCard) {
      this.firstCard = card;
    } else if (!this.secondCard) {
      this.secondCard = card;
      this.checkMatch();
    }
  }

  displayRestartButton() {
    if (
      this.restartButton.style.display !== "block" &&
      this.matchedPairs !== symbols.length
    ) {
      this.restartButton.style.display = "block";
    }
  }

  checkMatch() {
    if (this.firstCard.dataset.symbol === this.secondCard.dataset.symbol) {
      this.firstCard.classList.add("matched");
      this.secondCard.classList.add("matched");
      this.matchedPairs += 1;
      this.displayWinMessage();
      this.resetFlippedCards();
    } else {
      setTimeout(() => {
        this.firstCard.classList.add("hidden");
        this.secondCard.classList.add("hidden");
        this.firstCard.textContent = "";
        this.secondCard.textContent = "";
        this.resetFlippedCards();
      }, 1000);
    }
  }

  displayWinMessage() {
    if (this.matchedPairs === symbols.length) {
      setTimeout(() => {
        this.restartButton.style.display = "none";
        this.winPopupMessage.style.display = "block";
        this.container.classList.remove("fully-bright-container");
      }, 500);
    }
  }

  resetFlippedCards() {
    this.firstCard = null;
    this.secondCard = null;
  }

  startGame() {
    this.gameBoard.innerHTML = "";
    this.matchedPairs = 0;
    this.firstCard = null;
    this.secondCard = null;
    this.cards = [];
    this.createBoard();
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const memoryGame = new MemoryGame(document);
  });
}

module.exports = MemoryGame;
