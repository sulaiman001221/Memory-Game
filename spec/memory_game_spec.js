const { setupDom, startGame } = require("../src/memory_game");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("Memory Game", () => {
  let document,
    gameBoard,
    cards,
    startButton,
    winPopupMessage,
    symbols,
    startGameMessage,
    container,
    restartButton;

  beforeEach(() => {
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    const dom = new JSDOM(html);
    window = dom.window;
    document = dom.window.document;
    setupDom(document);
    gameBoard = document.getElementById("game-board");
    cards = gameBoard.querySelectorAll(".card");
    startButton = document.getElementById("start-button");
    winPopupMessage = document.querySelector(".win-popup-message");
    container = document.querySelector(".container");
    startGameMessage = document.querySelector(".start-game-message");
    restartButton = document.getElementById("restart-button");
    symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
    startGame();
    jasmine.clock().install();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jasmine.clock().uninstall();
  });

  describe("Board Initialization", () => {
    it("should create a board with a duplicate of available symbols and disabled cards", () => {
      const mockCards = gameBoard.querySelectorAll(".card");
      mockCards.forEach((card) => {
        expect(card.classList.contains("disabled")).toBe(true);
      });
      expect(mockCards.length).toBe(symbols.length * 2);
    });

    it("should shuffle the cards when the game has been started", () => {
      const initialOrder = Array.from(cards).map((card) => card.dataset.symbol);
      const newCards = gameBoard.querySelectorAll(".card");
      const newOrder = Array.from(newCards).map((card) => card.dataset.symbol);
      expect(newOrder).not.toEqual(initialOrder);
    });
  });

  describe("Start Game Event", () => {
    it("should start the game when the start button is clicked", () => {
      startButton.click();
      expect(startGameMessage.style.display).toBe("none");
      expect(container.classList.contains("fully-bright-container")).toBe(true);
      cards.forEach((card) => {
        expect(card.classList.contains("disabled")).toBe(false);
      });
    });
  });

  describe("Card Interaction", () => {
    it("should flip a card when clicked", () => {
      const mockCard = gameBoard.querySelector(".card");
      expect(mockCard.classList.contains("hidden")).toBe(true);
      mockCard.click();
      expect(mockCard.classList.contains("hidden")).toBe(false);
      expect(mockCard.textContent).toBe(mockCard.dataset.symbol);
    });

    it("should not allow a flipped card to be re-flipped", () => {
      const mockCard = gameBoard.querySelector(".card");
      mockCard.click();
      expect(mockCard.classList.contains("hidden")).toBe(false);
      mockCard.click();
      expect(mockCard.classList.contains("hidden")).toBe(false);
    });

    it("should hide the opened cards if their symbols are different", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      const card1 = mockCardsArray[0];
      const card2 = mockCardsArray.find(
        (card) => card.dataset.symbol !== card1.dataset.symbol && card !== card1
      );
      card1.click();
      card2.click();
      expect(card1.classList.contains("hidden")).toBe(false);
      expect(card2.classList.contains("hidden")).toBe(false);

      jasmine.clock().tick(1000);
      expect(card1.classList.contains("hidden")).toBe(true);
      expect(card2.classList.contains("hidden")).toBe(true);
    });

    it("should only display the restart button when the first card is flipped", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      const card = mockCardsArray[0];
      expect(restartButton.style.display).toBe("");
      card.click();
      expect(restartButton.style.display).toBe("block");
    });

    it("should match the cards when cards of similar symbols are opened", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      const card1 = mockCardsArray[0];
      const card2 = mockCardsArray.find(
        (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
      );
      card1.click();
      card2.click();

      expect(card1.classList.contains("matched")).toBe(true);
      expect(card2.classList.contains("matched")).toBe(true);
    });

    it("should not flip matched cards", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      const card1 = mockCardsArray[0];
      const card2 = mockCardsArray.find(
        (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
      );
      card1.click();
      card2.click();

      expect(card1.classList.contains("matched")).toBe(true);
      expect(card2.classList.contains("matched")).toBe(true);

      card1.click();
      card2.click();
      expect(card1.classList.contains("hidden")).toBe(false);
      expect(card2.classList.contains("hidden")).toBe(false);
    });
  });

  describe("Restart Game Event", () => {
    it("should restart the game when the restart button is clicked", () => {
      restartButton.click();

      expect(startGameMessage.style.display).toBe("block");
      expect(restartButton.style.display).toBe("none");
    });

    it("should land on the start game page when the play again button is clicked", () => {
      const playAgainButton = document.querySelector("#play-again-button");
      playAgainButton.click();

      expect(winPopupMessage.style.display).toBe("none");
      expect(startGameMessage.style.display).toBe("block");
    });
  });

  describe("Win Scenario", () => {
    it("should display a win message when all the cards have been matched", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      mockCardsArray.forEach((card) => {
        const card1 = card;
        card1.click();
        const card2 = mockCardsArray.find(
          (matchCard) =>
            matchCard.dataset.symbol === card1.dataset.symbol &&
            matchCard !== card1
        );
        card2.click();
      });
      jasmine.clock().tick(500);
      expect(winPopupMessage.style.display).toBe("block");
      expect(container.classList.contains("fully-bright-container")).toBe(
        false
      );
    });
  });
});
