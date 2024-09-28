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
    mockCards,
    mockCard,
    matchCard1,
    matchCard2,
    mockCardsArray;

  const flipAllMatchingPairs = () => {
    mockCardsArray.forEach((card) => {
      card.click();
      const matchingCard = mockCardsArray.find(
        (matchCard) =>
          matchCard.dataset.symbol === card.dataset.symbol && matchCard !== card
      );
      if (matchingCard) {
        matchingCard.click();
      }
    });
    jasmine.clock().tick(500);
  };

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
    memoryGame = new MemoryGame(document);
    mockCards = gameBoard.querySelectorAll(".card");
    mockCard = mockCards[0];
    mockCardsArray = Array.from(gameBoard.querySelectorAll(".card"));
    matchCard1 = mockCardsArray[0];
    matchCard2 = mockCardsArray.find(
      (card) =>
        card.dataset.symbol === matchCard1.dataset.symbol && card !== matchCard1
    );
    jasmine.clock().install();

    spyOn(memoryGame, "createBoard").and.callThrough();
    spyOn(memoryGame, "disableCards").and.callThrough();
    memoryGame.startGame();
    spyOn(memoryGame, "shuffle").and.callThrough();
    spyOn(memoryGame, "enableCards").and.callThrough();
    spyOn(memoryGame, "flipCard").and.callThrough();
    spyOn(memoryGame, "checkMatch").and.callThrough();
    spyOn(memoryGame, "displayRestartButton").and.callThrough();
    spyOn(memoryGame, "displayWinMessage").and.callThrough();
    spyOn(memoryGame, "startGame").and.callThrough();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jasmine.clock().uninstall();
    restartButton.click();
  });

  describe("Board Initialization", () => {
    it("should create a board with a duplicate of available symbols", () => {
      expect(memoryGame.createBoard).toHaveBeenCalledTimes(1);
      expect(mockCards.length).toBe(memoryGame.symbols.length * 2);
    });

    it("should shuffle the cards when the board is created", () => {
      memoryGame.createBoard();
      expect(memoryGame.shuffle).toHaveBeenCalledOnceWith(
        jasmine.arrayContaining([...memoryGame.symbols, ...memoryGame.symbols])
      );
    });

    it("should disable all cards after creation", () => {
      expect(memoryGame.disableCards).toHaveBeenCalledTimes(1);
      mockCards.forEach((card) => {
        expect(card.classList.contains("disabled")).toBeTrue();
      });
    });
  });

  describe("Start Game Event", () => {
    it("should start the game and initially hide the restart button when the start button is clicked", () => {
      startButton.click();
      expect(startGameMessage.style.display).toBe("none");
      expect(container.classList.contains("fully-bright-container")).toBe(true);
      expect(memoryGame.enableCards).toHaveBeenCalledTimes(1);
      expect(window.getComputedStyle(restartButton).display).toBe("none");
    });
  });

  describe("Card Interaction", () => {
    it("should flip a card when clicked", () => {
      mockCard.click();
      expect(memoryGame.flipCard).toHaveBeenCalledOnceWith(mockCard);
      expect(mockCard.classList.contains("hidden")).toBe(false);
      expect(mockCard.textContent).toBe(mockCard.dataset.symbol);
    });

    it("should not allow a flipped card to be re-flipped", () => {
      mockCard.click();
      mockCard.click();
      expect(memoryGame.flipCard).toHaveBeenCalledOnceWith(mockCard);
      expect(mockCard.classList.contains("hidden")).toBe(false);
    });

    it("should not allow flipping more than two cards at the same time", () => {
      const card1 = mockCards[1];
      const card2 = mockCards[2];
      const card3 = mockCards[4];

      card1.click();
      card2.click();
      card3.click();

      expect(card1.classList.contains("hidden")).toBe(false);
      expect(card2.classList.contains("hidden")).toBe(false);
      expect(card3.classList.contains("hidden")).toBe(true);
    });

    it("should hide the opened cards if their symbols are different", () => {
      const randomCard = mockCards[3];
      const differentCard = mockCardsArray.find(
        (card) => card.dataset.symbol !== randomCard.dataset.symbol
      );
      randomCard.click();
      differentCard.click();
      expect(memoryGame.checkMatch).toHaveBeenCalledTimes(1);
      jasmine.clock().tick(1000);
      expect(matchCard1.classList.contains("hidden")).toBe(true);
      expect(matchCard2.classList.contains("hidden")).toBe(true);
    });

    it("should display the restart button when the first card is flipped", () => {
      expect(window.getComputedStyle(restartButton).display).toBe("none");
      mockCard.click();
      expect(memoryGame.displayRestartButton).toHaveBeenCalledTimes(1);
      expect(restartButton.style.display).toBe("block");
    });

    it("should match the cards when cards of similar symbols are opened", () => {
      matchCard1.click();
      matchCard2.click();

      expect(memoryGame.checkMatch).toHaveBeenCalledTimes(1);
      expect(matchCard1.classList.contains("matched")).toBe(true);
      expect(matchCard2.classList.contains("matched")).toBe(true);
    });

    it("should not flip matched cards", () => {
      matchCard1.click();
      matchCard2.click();
      matchCard1.click();
      expect(matchCard1.classList.contains("hidden")).toBe(false);
    });
  });

  describe("Restart Game Event", () => {
    it("should restart the game when the restart button is clicked", () => {
      restartButton.click();
      expect(memoryGame.startGame).toHaveBeenCalledTimes(1);
      expect(startGameMessage.style.display).toBe("block");
      expect(restartButton.style.display).toBe("none");
    });

    it("should reset all matched cards when restart button is clicked", () => {
      matchCard1.click();
      matchCard2.click();
      restartButton.click();
      memoryGame.cards.forEach((card) => {
        expect(card.classList.contains("matched")).toBe(false);
      });
    });

    it("should land on the start game page when the play again button is clicked", () => {
      flipAllMatchingPairs();
      expect(window.getComputedStyle(winPopupMessage).display).toBe("block");

      const playAgainButton = document.querySelector("#play-again-button");
      playAgainButton.click();
      expect(memoryGame.startGame).toHaveBeenCalledTimes(1);
      expect(winPopupMessage.style.display).toBe("none");
      expect(startGameMessage.style.display).toBe("block");
    });
  });

  describe("Win Scenario", () => {
    it("should display a win message when all the cards have been matched", () => {
      flipAllMatchingPairs();
      expect(memoryGame.displayWinMessage).toHaveBeenCalledTimes(8);
      expect(winPopupMessage.style.display).toBe("block");
      expect(container.classList.contains("fully-bright-container")).toBe(
        false
      );
    });
  });
});
