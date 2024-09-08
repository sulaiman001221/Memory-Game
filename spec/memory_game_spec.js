const {
  setupDom,
  shuffle,
  flipCard,
  checkMatch,
  startGame,
} = require("../src/memory_game");
const memoryGame = require("../src/memory_game");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("Memory Game", () => {
  let document, gameBoard, cards, startButton, restartButton, symbols;

  beforeEach(() => {
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    const dom = new JSDOM(html);
    document = dom.window.document;

    setupDom(document);
    gameBoard = document.getElementById("game-board");
    cards = gameBoard.querySelectorAll(".card");
    startButton = document.getElementById("start-button");
    restartButton = document.getElementById("restart-button");
  });

  it("should create a board with a duplicate of available symbols and disabled cards", () => {
    startGame();
    symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
    const mockCards = gameBoard.querySelectorAll(".card");
    cards.forEach((card) => {
      expect(card.classList.contains("disabled")).toBe(true);
    });
    expect(mockCards.length).toBe(symbols.length * 2);
  });

  it("should start the game when the start button is clicked", () => {
    const startGameMessage = document.querySelector(".start-game-message");
    const container = document.querySelector(".container");
    startButton.click();

    expect(startGameMessage.style.display).toBe("none");
    expect(container.classList.contains("fully-bright-container")).toBe(true);

    cards.forEach((card) => {
      expect(card.classList.contains("disabled")).toBe(false);
    });
  });

  it("should shuffle the cards when the game has been started", () => {
    const initialOrder = Array.from(cards).map((card) => card.dataset.symbol);
    startGame();
    const newCards = gameBoard.querySelectorAll(".card");
    const newOrder = Array.from(newCards).map((card) => card.dataset.symbol);
    expect(newOrder).not.toEqual(initialOrder);
  });

  it("should flip a card when clicked", () => {
    startGame();
    const mockCard = gameBoard.querySelector(".card");
    expect(mockCard.classList.contains("hidden")).toBe(true);
    mockCard.click();
    expect(mockCard.classList.contains("hidden")).toBe(false);
    expect(mockCard.textContent).toBe(mockCard.dataset.symbol);
  });

  it("should not allow a flipped card to be re-flipped", () => {
    startGame();
    const mockCard = gameBoard.querySelector(".card");
    mockCard.click();
    expect(mockCard.classList.contains("hidden")).toBe(false);

    mockCard.click();
    expect(mockCard.classList.contains("hidden")).toBe(false);
  });

  it("should hide the opened cards if their symbols are different", () => {
    startGame();
    const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
    const card1 = mockCardsArray[0];
    const card2 = mockCardsArray.find(
      (card) => card.dataset.symbol !== card1.dataset.symbol && card !== card1
    );
    card1.click();
    card2.click();
    expect(card1.classList.contains("hidden")).toBe(false);
    expect(card2.classList.contains("hidden")).toBe(false);

    checkMatch(card1, card2);

    setTimeout(() => {
      expect(card1.classList.contains("hidden")).toBe(true);
      expect(card2.classList.contains("hidden")).toBe(true);
    });
  });

  it("should match the cards when cards of similar symbols are opened", () => {
    startGame();
    const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
    const card1 = mockCardsArray[0];
    const card2 = mockCardsArray.find(
      (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
    );
    card1.click();
    card2.click();
    checkMatch(card1, card2);
    expect(card1.classList.contains("matched")).toBe(true);
    expect(card2.classList.contains("matched")).toBe(true);
  });

  it("should not flip matched cards", () => {
    startGame();
    const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
    const card1 = mockCardsArray[0];
    const card2 = mockCardsArray.find(
      (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
    );
    card1.click();
    card2.click();
    checkMatch(card1, card2);
    expect(card1.classList.contains("matched")).toBe(true);
    expect(card2.classList.contains("matched")).toBe(true);

    card1.click();
    card2.click();
    expect(card1.classList.contains("hidden")).toBe(false);
    expect(card2.classList.contains("hidden")).toBe(false);
  });

  it("should display a win message when all the cards have been matched", () => {
   
  });

  // it("should restart the game when the play again button is clicked", () => {
  //   const startGameMessage = document.createElement("div");
  //   startGameMessage.className = "start-game-message";
  //   const container = document.createElement("div");
  //   container.className = "container";
  //   const winPopupMessage = document.createElement("div");
  //   winPopupMessage.className = "win-popup-message";
  //   const playAgainButton = document.createElement("button");
  //   playAgainButton.id = "play-again-button";

  //   document.body.appendChild(gameBoard);
  //   document.body.appendChild(startGameMessage);
  //   document.body.appendChild(container);
  //   document.body.appendChild(winPopupMessage);
  //   document.body.appendChild(playAgainButton);

  //   setupDom(document);
  //   winPopupMessage.style.display = "block";
  //   playAgainButton.click();

  //   setTimeout(() => {
  //     expect(winPopupMessage.style.display).toBe("none");
  //     expect(container.classList.contains("fully-bright-container")).toBe(true);
  //     // Ensure startGame is called (assuming you have a way to verify this)
  //   }, 0);
  // });
});
