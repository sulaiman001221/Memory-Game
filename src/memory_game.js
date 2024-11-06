class MemoryGame {
  constructor(document) {
    this.symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
    this.tempSymbols = [];
    this.document = document;

    this.startTime = null;
    this.timerInterval = null;
    this.timerDisplay = null;

    this.winPopupMessage = null;
    this.container = null;
    this.gameBoard = null;
    this.startButton = null;
    this.restartButton = null;
    this.playAgainButton = null;
    this.startGameMessage = null;
    this.twoByThreeGridButton = null;
    this.threeByFourGridButton = null;
    this.fourByFourGridButton = null;
    this.cards = [];
    this.firstCard = null;
    this.secondCard = null;
    this.matchedPairs = 0;
    this.flipCount = 0;

    this.setupDom();
  }

  setupDom() {
    this.winPopupMessage = this.document.querySelector(".win-popup-message");
    this.container = this.document.querySelector(".container");
    this.gameBoard = this.document.querySelector(".game-board");
    this.startButton = this.document.querySelector("#start-button");
    this.restartButton = this.document.querySelector("#restart-button");
    this.playAgainButton = this.document.querySelector("#play-again-button");
    this.startGameMessage = this.document.querySelector(".start-game-message");
    this.twoByThreeGridButton = this.document.querySelector("#grid-button-2x3");
    this.threeByFourGridButton =
      this.document.querySelector("#grid-button-3x4");
    this.fourByFourGridButton = this.document.querySelector("#grid-button-4x4");
    this.timerDisplay = this.document.querySelector("#timer");
    this.flipCountDisplay = document.getElementById("flip-count");

    this.fourByFourButtonHandler();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.startButton.addEventListener("click", () => this.startGameHandler());
    this.restartButton.addEventListener("click", () =>
      this.restartGameHandler()
    );
    this.playAgainButton.addEventListener("click", () =>
      this.playAgainHandler()
    );
    this.twoByThreeGridButton.addEventListener("click", () =>
      this.twoByThreeButtonHandler()
    );
    this.threeByFourGridButton.addEventListener("click", () =>
      this.threeByFourButtonHandler()
    );
    this.fourByFourGridButton.addEventListener("click", () =>
      this.fourByFourButtonHandler()
    );
  }

  startTimer() {
    this.startTime = new Date().getTime();
    this.timerInterval = setInterval(() => {
      const elapsedTime = Math.floor(
        (new Date().getTime() - this.startTime) / 1000
      );
      const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
      const seconds = String(elapsedTime % 60).padStart(2, "0");
      this.timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  incrementFlipCount() {
    this.flipCount += 1;
    this.flipCountDisplay.textContent = flipCount;
  }

  resetFlipCount() {
    flipCount = 0;
    this.flipCountDisplay.textContent = flipCount;
  }

  createBoard(cardsNum) {
    if (!this.gameBoard) return;
    this.cards = [];
    const slicedSymbols = this.symbols.slice(0, cardsNum);
    this.tempSymbols = slicedSymbols;
    const cardSymbols = this.shuffle([...slicedSymbols, ...slicedSymbols]);
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
      this.incrementFlipCount();
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

    this.startTimer();
  }

  restartGameHandler() {
    this.resetFlipCount;
    this.stopTimer();
    this.timerDisplay.textContent = "00:00";

    this.fourByFourButtonHandler();
    this.startGameMessage.style.display = "block";
    this.container.classList.remove("fully-bright-container");
    this.restartButton.style.display = "none";
  }

  playAgainHandler() {
    this.resetFlipCount();
    this.stopTimer();
    this.timerDisplay.textContent = "00:00";

    this.fourByFourButtonHandler();
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
      this.matchedPairs !== this.tempSymbols.length
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
    if (this.matchedPairs === this.tempSymbols.length) this.displayWinMessage();
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
    if (this.matchedPairs === this.tempSymbols.length) {
      this.stopTimer();
      const elapsedTime = Math.floor(
        (new Date().getTime() - this.startTime) / 1000
      );
      const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
      const seconds = String(elapsedTime % 60).padStart(2, "0");
      setTimeout(() => {
        this.restartButton.style.display = "none";
        this.winPopupMessage.style.display = "block";
        this.container.classList.remove("fully-bright-container");
        this.winPopupMessage.querySelector(
          "#time"
        ).textContent = `Time Taken: ${minutes}:${seconds}`;
      }, 500);
    }
  }

  resetFlippedCards() {
    this.firstCard = null;
    this.secondCard = null;
  }

  startGame(cardsNum) {
    this.gameBoard.innerHTML = "";
    this.matchedPairs = 0;
    this.firstCard = null;
    this.secondCard = null;
    this.cards = [];
    this.createBoard(cardsNum);
  }

  twoByThreeButtonHandler() {
    const cardsNum = 3;
    this.resetGameBoardClasses();
    this.startGame(cardsNum);
    this.gameBoard.classList.add("game-board");
    this.gameBoard.classList.add("use-3-cols");
    this.twoByThreeGridButton.classList.add("selectGridButton");
    this.threeByFourGridButton.classList.remove("selectGridButton");
    this.fourByFourGridButton.classList.remove("selectGridButton");
  }

  threeByFourButtonHandler() {
    const cardsNum = 6;
    this.resetGameBoardClasses();
    this.startGame(cardsNum);
    this.gameBoard.classList.add("game-board");
    this.twoByThreeGridButton.classList.remove("selectGridButton");
    this.threeByFourGridButton.classList.add("selectGridButton");
    this.fourByFourGridButton.classList.remove("selectGridButton");
  }

  fourByFourButtonHandler() {
    const defaultCardsNum = this.symbols.length;
    this.resetGameBoardClasses();
    this.startGame(defaultCardsNum);
    this.gameBoard.classList.add("game-board");
    this.twoByThreeGridButton.classList.remove("selectGridButton");
    this.threeByFourGridButton.classList.remove("selectGridButton");
    this.fourByFourGridButton.classList.add("selectGridButton");
  }

  resetGameBoardClasses() {
    this.gameBoard.classList.remove("use-3-cols", "game-board");
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    new MemoryGame(document);
  });
}

module.exports = MemoryGame;
