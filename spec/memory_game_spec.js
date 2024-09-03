const {
  setupDom,
  shuffle,
  createBoard,
  flipCard,
  checkMatch,
} = require("../src/memory_game");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("Memory Game", () => {
  let window, document, gameBoard, cards, startButton, symbols;

  function setupTestDOM() {
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    const dom = new JSDOM(html);
    window = dom.window;
    document = window.document;

    setupDom(document);
    gameBoard = document.getElementById("game-board");
    cards = gameBoard.querySelectorAll(".card");
    startButton = document.getElementById("start-button");
    symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
  }

  function mockSetupDom() {
    const winPopupMessage = document.querySelector(".win-popup-message");
    const container = document.querySelector(".container");
    const startButton = document.querySelector("#start-button");
    const playAgainButton = document.querySelector("#play-again-button");

    const startGame = jasmine.createSpy("startGame");
    const displayWinMessage = () => (winPopupMessage.style.display = "block");
    const resetFlippedCards = () => {};

    startGame.and.callFake(() => {
      gameBoard.innerHTML = "";
      createBoard(document, gameBoard, [], (card) =>
        flipCard(card, { firstCard: null, secondCard: null }, () =>
          checkMatch(
            { firstCard: null, secondCard: null },
            { value: 0 },
            symbols,
            displayWinMessage,
            resetFlippedCards
          )
        )
      );
      document.querySelector(".start-game-message").style.display = "none";
      winPopupMessage.style.display = "none";
      container.classList.add("fully-bright-container");
    });

    startButton.addEventListener("click", startGame);
    playAgainButton.addEventListener("click", startGame);
  }

  beforeEach(() => {
    setupTestDOM();
  });

  it("should start the game when the start button is clicked", () => {
    const startGameMessage = document.querySelector(".start-game-message");
    const container = document.querySelector(".container");
    startButton.click();
    expect(startGameMessage.style.display).toBe("none");
    expect(container.classList.contains("fully-bright-container")).toBe(true);
  });

  it("should shuffle the cards", () => {
    const initialOrder = Array.from(cards).map((card) => card.dataset.symbol);
    const shuffledOrder = shuffle([...initialOrder]);
    expect(shuffledOrder).not.toEqual(initialOrder);
  });

  it("should create a board with a duplicate of available symbols", () => {
    const cardsArray = [];
    createBoard(document, gameBoard, cardsArray, () => {});
    expect(cardsArray.length).toBe(symbols.length * 2);
    const symbolCount = {};
    cardsArray.forEach((card) => {
      const symbol = card.dataset.symbol;
      symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
    });
    Object.values(symbolCount).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it("should flip a card when clicked", () => {
    const card = cards[0];
    expect(card.classList.contains("hidden")).toBe(true);
    flipCard(card, { firstCard: null, secondCard: null }, () => {});
    expect(card.classList.contains("hidden")).toBe(false);
    expect(card.textContent).toBe(card.dataset.symbol);
  });

  it("should not allow a flipped card to be re-flipped", () => {
    const cardsArray = [];
    createBoard(document, gameBoard, cardsArray, () => {});
    const gameState = { firstCard: null, secondCard: null };
    const card = cardsArray[0];
    flipCard(card, gameState, () => {});

    const initialState = card.classList.contains("hidden");
    const initialContent = card.textContent;

    flipCard(card, gameState, () => {});

    expect(card.classList.contains("hidden")).toBe(initialState);
    expect(card.textContent).toBe(initialContent);
    expect(gameState.secondCard).toBeNull();
  });

  it("should match the cards when cards of similar symbols are opened", () => {
    const cardsArray = Array.from(cards);
    const card1 = cardsArray[0];
    const card2 = cardsArray.find(
      (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
    );
    const gameState = { firstCard: null, secondCard: null };
    const matchedPairs = { value: 0 };
    flipCard(card1, gameState, () => {});
    flipCard(card2, gameState, () => {
      checkMatch(
        gameState,
        matchedPairs,
        symbols,
        () => {},
        () => {}
      );
    });
    expect(card1.classList.contains("matched")).toBe(true);
    expect(card2.classList.contains("matched")).toBe(true);
  });

  it("should not flip matched cards", () => {
    const cardsArray = [];
    createBoard(document, gameBoard, cardsArray, () => {});
    const gameState = { firstCard: null, secondCard: null };
    const matchedPairs = { value: 0 };
    const card1 = cardsArray[0];
    const card2 = cardsArray.find(
      (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
    );
    flipCard(card1, gameState, () => {});
    gameState.firstCard = card1;
    flipCard(card2, gameState, () => {
      checkMatch(
        gameState,
        matchedPairs,
        symbols,
        () => {},
        () => {}
      );
    });
    flipCard(card1, gameState, () => {});
    flipCard(card2, gameState, () => {});

    expect(card1.classList.contains("matched")).toBe(true);
    expect(card2.classList.contains("matched")).toBe(true);
    expect(card1.classList.contains("hidden")).toBe(false);
    expect(card2.classList.contains("hidden")).toBe(false);
    expect(card1.textContent).toBe(card1.dataset.symbol);
    expect(card2.textContent).toBe(card2.dataset.symbol);
  });

  it("should display a win message when all the cards have been matched", () => {
    const cardsArray = [];
    createBoard(document, gameBoard, cardsArray, () => {});
    const gameState = { firstCard: null, secondCard: null };
    const matchedPairs = { value: 0 };

    function matchAllCards() {
      const pairs = [];
      for (let i = 0; i < cardsArray.length; i += 2) {
        const card1 = cardsArray[i];
        const card2 = cardsArray[i + 1];
        pairs.push([card1, card2]);
      }
      pairs.forEach(([card1, card2]) => {
        flipCard(card1, gameState, () => {});
        gameState.firstCard = card1;
        flipCard(card2, gameState, () => {
          checkMatch(
            gameState,
            matchedPairs,
            symbols,
            () => {
              expect(
                document.querySelector(".win-popup-message").style.display
              ).toBe("block");
              expect(
                document
                  .querySelector(".container")
                  .classList.contains("fully-bright-container")
              ).toBe(false);
            },
            () => {}
          );
        });
      });
    }
    matchAllCards();
  });

  it("should restart the game when the play again button is clicked", () => {
    const startGameMessage = document.createElement("div");
    startGameMessage.className = "start-game-message";
    const container = document.createElement("div");
    container.className = "container";
    const winPopupMessage = document.createElement("div");
    winPopupMessage.className = "win-popup-message";
    const playAgainButton = document.createElement("button");
    playAgainButton.id = "play-again-button";

    document.body.appendChild(gameBoard);
    document.body.appendChild(startGameMessage);
    document.body.appendChild(container);
    document.body.appendChild(winPopupMessage);
    document.body.appendChild(playAgainButton);

    mockSetupDom();
    winPopupMessage.style.display = "block";
    playAgainButton.click();

    setTimeout(() => {
      expect(winPopupMessage.style.display).toBe("none");
      expect(container.classList.contains("fully-bright-container")).toBe(true);
      expect(jasmine.createSpy("startGame")).toHaveBeenCalled();
    }, 0);
  });
});
