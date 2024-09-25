const MemoryGame = require("../src/memory_game");
const { setupDom } = require("./dom_setup");

describe("Memory Game", () => {
  let document,
    window,
    gameBoard,
    startButton,
    winPopupMessage,
    container,
    restartButton,
    startGameMessage,
    memoryGame,
    dom;

  beforeEach(() => {
    const setup = setupDom();
    document = setup.document;
    window = setup.window;
    gameBoard = setup.gameBoard;
    startButton = setup.startButton;
    winPopupMessage = setup.winPopupMessage;
    container = setup.container;
    restartButton = setup.restartButton;
    startGameMessage = setup.startGameMessage;
    dom = setup.dom;
    memoryGame = new MemoryGame(document);
    jasmine.clock().install();

    spyOn(memoryGame, "createBoard").and.callThrough();
    spyOn(memoryGame, "shuffle").and.callThrough();
    memoryGame.startGame();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jasmine.clock().uninstall();
  });

  describe("Board Initialization", () => {
    it("should create a board with a duplicate of available symbols", () => {
      expect(memoryGame.createBoard).toHaveBeenCalled();
      const mockCards = gameBoard.querySelectorAll(".card");
      expect(mockCards.length).toBe(memoryGame.symbols.length * 2);
    });

    it("should create a board with disabled cards", () => {
      expect(memoryGame.createBoard).toHaveBeenCalled();
      const mockCards = gameBoard.querySelectorAll(".card");
      mockCards.forEach((card) => {
        expect(card.classList.contains("disabled")).toBe(true);
      });
    });

    it("should shuffle the cards when the game has been started", () => {
      const initialOrder = [...memoryGame.symbols, ...memoryGame.symbols];
      const newCards = gameBoard.querySelectorAll(".card");
      const newOrder = Array.from(newCards).map((card) => card.dataset.symbol);
      expect(newOrder).not.toEqual(initialOrder);
    });
  });

  describe("Start Game Event", () => {
    it("should start the game and initially hide the restart button when the start button is clicked", () => {
      spyOn(memoryGame, "enableCards").and.callThrough();
      startButton.click();

      expect(startGameMessage.style.display).toBe("none");
      expect(container.classList.contains("fully-bright-container")).toBe(true);
      expect(memoryGame.enableCards).toHaveBeenCalled();
      expect(window.getComputedStyle(restartButton).display).toBe("none");
    });
  });

  describe("Card Interaction", () => {
    it("should flip a card when clicked", () => {
      const mockCard = gameBoard.querySelector(".card");
      spyOn(memoryGame, "flipCard").and.callThrough();
      mockCard.click();
      expect(memoryGame.flipCard).toHaveBeenCalledWith(mockCard);
      expect(mockCard.classList.contains("hidden")).toBe(false);
      expect(mockCard.textContent).toBe(mockCard.dataset.symbol);
    });

    it("should not allow a flipped card to be re-flipped", () => {
      const mockCard = gameBoard.querySelector(".card");
      spyOn(memoryGame, "flipCard").and.callThrough();
      mockCard.click();
      mockCard.click();
      expect(memoryGame.flipCard).toHaveBeenCalledTimes(2);
      expect(mockCard.classList.contains("hidden")).toBe(false);
    });

    it("should not allow flipping more than two cards at the same time", () => {
      const mockCard = gameBoard.querySelectorAll(".card");
      const card1 = mockCard[0];
      const card2 = mockCard[1];
      const card3 = mockCard[2];

      card1.click();
      card2.click();
      card3.click();

      expect(card1.classList.contains("hidden")).toBe(false);
      expect(card2.classList.contains("hidden")).toBe(false);
      expect(card3.classList.contains("hidden")).toBe(true);
    });

    it("should hide the opened cards if their symbols are different", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      const card1 = mockCardsArray[0];
      const card2 = mockCardsArray.find(
        (card) => card.dataset.symbol !== card1.dataset.symbol && card !== card1
      );

      spyOn(memoryGame, "checkMatch").and.callThrough();
      card1.click();
      card2.click();

      expect(memoryGame.checkMatch).toHaveBeenCalled();
      jasmine.clock().tick(1000);
      expect(card1.classList.contains("hidden")).toBe(true);
      expect(card2.classList.contains("hidden")).toBe(true);
    });

    it("should display the restart button when the first card is flipped", () => {
      const mockCards = gameBoard.querySelectorAll(".card");
      const card = mockCards[0];
      expect(restartButton.style.display).toBe("");
      spyOn(memoryGame, "displayRestartButton").and.callThrough();
      card.click();
      expect(memoryGame.displayRestartButton).toHaveBeenCalled();
      expect(restartButton.style.display).toBe("block");
    });

    it("should match the cards when cards of similar symbols are opened", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      const card1 = mockCardsArray[0];
      const card2 = mockCardsArray.find(
        (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
      );
      spyOn(memoryGame, "checkMatch").and.callThrough();
      card1.click();
      card2.click();

      expect(memoryGame.checkMatch).toHaveBeenCalled();
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
      card1.click();

      expect(card1.classList.contains("hidden")).toBe(false);
    });
  });

  describe("Restart Game Event", () => {
    it("should restart the game when the restart button is clicked", () => {
      spyOn(memoryGame, "startGame").and.callThrough();
      restartButton.click();
      expect(memoryGame.startGame).toHaveBeenCalled();
      expect(startGameMessage.style.display).toBe("block");
      expect(restartButton.style.display).toBe("none");
    });

    it("should land on the start game page when the play again button is clicked", () => {
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
      expect(window.getComputedStyle(winPopupMessage).display).toBe("block");

      const playAgainButton = document.querySelector("#play-again-button");
      spyOn(memoryGame, "startGame").and.callThrough();
      playAgainButton.click();
      expect(memoryGame.startGame).toHaveBeenCalled();
      expect(winPopupMessage.style.display).toBe("none");
      expect(startGameMessage.style.display).toBe("block");
    });
  });

  describe("Win Scenario", () => {
    it("should display a win message when all the cards have been matched", () => {
      const mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
      spyOn(memoryGame, "displayWinMessage").and.callThrough();
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
      expect(memoryGame.displayWinMessage).toHaveBeenCalled();
      expect(winPopupMessage.style.display).toBe("block");
      expect(container.classList.contains("fully-bright-container")).toBe(
        false
      );
    });
  });
});
