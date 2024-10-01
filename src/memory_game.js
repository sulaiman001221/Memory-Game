class MemoryGame {
  constructor(document) {
    this.symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
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

    this.setupEventListeners();
    this.createBoard();
  }

  setupEventListeners() {
    this.startButton.addEventListener("click", () => this.startGameHandler());
    this.restartButton.addEventListener("click", () =>
      this.restartGameHandler()
    );
    this.playAgainButton.addEventListener("click", () =>
      this.playAgainHandler()
    );
  }

  createBoard() {
    if (!this.gameBoard) return;
    this.cards = [];

    const cardSymbols = this.shuffle([...this.symbols, ...this.symbols]);
    cardSymbols.forEach((symbol) => {
      const newCard = this.createCardElement(symbol);
      this.cards.push(newCard);
    });

    this.disableCards();
  }

  createCardElement(symbol) {
    const newCard = this.document.createElement("div");
    newCard.classList.add("hidden", "card");
    newCard.dataset.symbol = symbol;
    newCard.addEventListener("click", () => this.handleCardClick(newCard));
    this.gameBoard.appendChild(newCard);
    return newCard;
  }

  handleCardClick(card) {
    if (this.isCardClickable(card)) {
      this.flipCard(card);
      this.displayRestartButton();
    }
  }

  isCardClickable(card) {
    return !(
      card.classList.contains("matched") ||
      card === this.firstCard ||
      this.secondCard
    );
  }

  startGameHandler() {
    this.enableCards();
    this.startGameMessage.style.display = "none";
    this.container.classList.add("fully-bright-container");
  }

  restartGameHandler() {
    this.startGame();
    this.startGameMessage.style.display = "block";
    this.container.classList.remove("fully-bright-container");
    this.restartButton.style.display = "none";
  }

  playAgainHandler() {
    this.startGame();
    this.winPopupMessage.style.display = "none";
    this.startGameMessage.style.display = "block";
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
    card.classList.remove("hidden");
    card.textContent = card.dataset.symbol;

    if (!this.firstCard) {
      this.firstCard = card;
    } else {
      this.secondCard = card;
      this.checkMatch();
    }
  }

  displayRestartButton() {
    if (
      this.restartButton.style.display !== "block" &&
      this.matchedPairs !== this.symbols.length
    ) {
      this.restartButton.style.display = "block";
    }
  }

  checkMatch() {
    if (this.firstCard.dataset.symbol === this.secondCard.dataset.symbol) {
      this.matchCards();
    } else {
      this.hideUnmatchedCards();
    }
  }

  matchCards() {
    this.firstCard.classList.add("matched");
    this.secondCard.classList.add("matched");
    this.matchedPairs += 1;
    if (this.matchedPairs === 8) this.displayWinMessage();
    this.resetFlippedCards();
  }

  hideUnmatchedCards() {
    setTimeout(() => {
      this.firstCard.classList.add("hidden");
      this.secondCard.classList.add("hidden");
      this.firstCard.textContent = "";
      this.secondCard.textContent = "";
      this.resetFlippedCards();
    }, 1000);
  }

  displayWinMessage() {
    if (this.matchedPairs === this.symbols.length) {
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
    new MemoryGame(document);
  });
}

module.exports = MemoryGame;
