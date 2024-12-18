import MemoryGame from "../src/memory_game.js";
import setupDom  from "./configs/dom_setup.js";


describe("Memory Game", () => {
  let document,
    window,
    setup,
    timerDisplay,
    gameBoard,
    winPopupMessage,
    container,
    startButton,
    restartButton,
    playAgainButton,
    startGameMessage,
    memoryGame,
    mockCards,
    mockCard,
    matchCard1,
    matchCard2,
    mockCardsArray,
    flipCountDisplay;

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
    setup = setupDom();
    document = setup.document;
    window = setup.window;
    memoryGame = new MemoryGame(document);

    timerDisplay = document.querySelector("#timer");
    gameBoard = document.querySelector(".game-board");
    winPopupMessage = document.querySelector(".win-popup-message");
    container = document.querySelector(".container");
    startButton = document.querySelector("#start-button");
    restartButton = document.querySelector("#restart-button");
    playAgainButton = document.querySelector("#play-again-button");
    startGameMessage = document.querySelector(".start-game-message");
    flipCountDisplay = document.getElementById("flip-count");

    mockCards = gameBoard.querySelectorAll(".card");
    mockCard = mockCards[0];
    mockCardsArray = Array.from(mockCards);
    matchCard1 = mockCardsArray[0];
    matchCard2 = mockCardsArray.find(
      (card) =>
        card.dataset.symbol === matchCard1.dataset.symbol && card !== matchCard1
    );

    jasmine.clock().install();
    memoryGame.startGame();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    restartButton.click();
  });

  describe("Timer", () => {
    it("should display the timer when the game begins", () => {
      expect(timerDisplay.textContent).toBe("00:00");
    });

    it("should stop the timer when the game is completed", () => {
      spyOn(memoryGame, "stopTimer").and.callFake(() => {
        clearInterval(memoryGame.timerInterval);
        memoryGame.timerInterval = null;
      });

      flipAllMatchingPairs();

      expect(memoryGame.stopTimer).toHaveBeenCalled();
      expect(memoryGame.timerInterval).toBeNull();
      expect(window.getComputedStyle(winPopupMessage).display).toBe("block");
    });

    it("should reset the timer to 00:00 when the game is restarted", () => {
      timerDisplay.textContent = "00:30";
      restartButton.click();
      expect(timerDisplay.textContent).toBe("00:00");
    });

    it("should reset the timer to 00:00 when play again is clicked after winning", () => {
      timerDisplay.textContent = "00:30";
      flipAllMatchingPairs();
      playAgainButton.click();
      expect(timerDisplay.textContent).toBe("00:00");
      expect(winPopupMessage.style.display).toBe("none");
    });
  });

  describe("Flip Count", () => {
    it("should increment the flip count each time a card is flipped", () => {
      expect(memoryGame.flipCount).toBe(0);
      expect(flipCountDisplay.textContent).toBe("0");

      mockCards[0].click();
      expect(memoryGame.flipCount).toBe(1);
      expect(flipCountDisplay.textContent).toBe("1");

      mockCards[1].click();
      expect(memoryGame.flipCount).toBe(2);
      expect(flipCountDisplay.textContent).toBe("2");
    });

    it("should reset the flip count when the game is restarted", () => {
      mockCards[0].click();
      mockCards[1].click();
      expect(memoryGame.flipCount).toBe(2);

      memoryGame.restartGameHandler();

      expect(memoryGame.flipCount).toBe(0);
      expect(flipCountDisplay.textContent).toBe("0");
    });

    it("should reset the flip count on win when play again is clicked", () => {
      flipCountDisplay.textContent = "10";
      flipAllMatchingPairs();
      playAgainButton.click();
      expect(flipCountDisplay.textContent).toBe("0");
    });
  });

  describe("Grid Configuration", () => {
    it("should create the board according to the selected grid size", () => {
      spyOn(memoryGame, "startGame").and.callThrough();

      document.querySelector("#grid-button-2x3").click();
      expect(memoryGame.startGame).toHaveBeenCalledWith(3);
      expect(gameBoard.querySelectorAll(".card").length).toBe(6);
      expect(gameBoard.classList.contains("use-3-cols")).toBe(true);

      document.querySelector("#grid-button-3x4").click();
      expect(memoryGame.startGame).toHaveBeenCalledWith(6);
      expect(gameBoard.querySelectorAll(".card").length).toBe(12);
      expect(gameBoard.classList.contains("use-3-cols")).toBe(false);

      document.querySelector("#grid-button-4x4").click();
      expect(memoryGame.startGame).toHaveBeenCalledWith(8);
      expect(gameBoard.querySelectorAll(".card").length).toBe(16);
      expect(gameBoard.classList.contains("use-3-cols")).toBe(false);
    });
  });

  describe("Board Initialization", () => {
    it("should create a board with a duplicate of available symbols", () => {
      spyOn(memoryGame, "createBoard").and.callThrough();
      restartButton.click();
      expect(memoryGame.createBoard).toHaveBeenCalledTimes(1);
      expect(mockCards.length).toBe(memoryGame.symbols.length * 2);
    });

    it("should shuffle the cards when the board is created", () => {
      const initialSymbolOrder = [...memoryGame.symbols, ...memoryGame.symbols];
      spyOn(memoryGame, "shuffle").and.callThrough();
      memoryGame.createBoard();
      const shuffledSymbols = memoryGame.cards.map(
        (card) => card.dataset.symbol
      );
      expect(shuffledSymbols).not.toEqual(initialSymbolOrder);
      expect(memoryGame.shuffle).toHaveBeenCalledOnceWith(
        jasmine.arrayContaining(initialSymbolOrder)
      );
    });

    it("should disable all cards after creation", () => {
      spyOn(memoryGame, "disableCards").and.callThrough();
      restartButton.click();
      expect(memoryGame.disableCards).toHaveBeenCalledTimes(1);
      mockCards.forEach((card) => {
        expect(card.classList.contains("disabled")).toBeTrue();
      });
    });
  });

  describe("Start Game Event", () => {
    it("should start the game and initially hide the restart button when the start button is clicked", () => {
      spyOn(memoryGame, "enableCards").and.callThrough();
      startButton.click();
      expect(startGameMessage.style.display).toBe("none");
      expect(container.classList.contains("fully-bright-container")).toBe(true);
      expect(memoryGame.enableCards).toHaveBeenCalledTimes(1);
      expect(window.getComputedStyle(restartButton).display).toBe("none");
    });
  });

  describe("Card Interaction", () => {
    beforeEach(() => {
      spyOn(memoryGame, "flipCard").and.callThrough();
      spyOn(memoryGame, "checkMatch").and.callThrough();
    });

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
      const card3 = mockCardsArray.find(
        (card) =>
          card.dataset.symbol !== card1.dataset.symbol &&
          card.dataset.symbol !== card2.dataset.symbol
      );

      card1.click();
      card3.click();
      card2.click();

      expect(memoryGame.flipCard).toHaveBeenCalledTimes(2);
      expect(memoryGame.flipCard).toHaveBeenCalledWith(card1);
      expect(memoryGame.flipCard).toHaveBeenCalledWith(card3);
      expect(memoryGame.flipCard).not.toHaveBeenCalledWith(card2);
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
      expect(randomCard.classList.contains("hidden")).toBe(true);
      expect(differentCard.classList.contains("hidden")).toBe(true);
    });

    it("should display the restart button when the first card is flipped", () => {
      spyOn(memoryGame, "displayRestartButton").and.callThrough();
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
    beforeEach(() => {
      spyOn(memoryGame, "startGame").and.callThrough();
    });

    it("should restart the game when the restart button is clicked", () => {
      mockCard.click();
      expect(mockCard.classList.contains("hidden")).toBe(false);

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
      spyOn(memoryGame, "displayWinMessage").and.callThrough();
      flipAllMatchingPairs();
      expect(memoryGame.displayWinMessage).toHaveBeenCalledTimes(1);
      expect(winPopupMessage.style.display).toBe("block");
      expect(container.classList.contains("fully-bright-container")).toBe(
        false
      );
    });
  });
});
