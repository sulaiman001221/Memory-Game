const { setupDom } = require("../src/memory_game");
const { JSDOM } = require("jsdom");

describe("Memory Game", function () {
  let gameBoard, restartButton, cards, alertSpy, dom, document, html;

  beforeEach(function () {
    html = `
    <div id="game-board"></div>
    <button id="restart-button">Restart Game</button>
`;
    dom = new JSDOM(html);
    document = dom.window.document;
    setupDom(document);

    gameBoard = document.getElementById("game-board");
    restartButton = document.getElementById("restart-button");

   // alertSpy = spyOn(window, "alert");
    //memoryGame.init();
    cards = gameBoard.querySelectorAll(".card");
  });

  it("should create the correct number of cards", function () {
    expect(cards.length).toBe(16); // 8 pairs
  });

  it("should shuffle cards", function () {
    const symbols = Array.from(cards).map((card) => card.dataset.symbol);
    const sortedSymbols = [...symbols].sort();
    expect(symbols).not.toEqual(sortedSymbols); // Expect that the cards are shuffled
  });

  it("should flip a card when clicked", function () {
    const card = cards[0];
    card.click();
    expect(card.classList.contains("hidden")).toBe(false);
    expect(card.textContent).toBe(card.dataset.symbol);
  });

  it("should match two identical cards", function () {
    const card1 = cards[0];
    const card2 = Array.from(cards).find(
      (card) => card.dataset.symbol === card1.dataset.symbol && card !== card1
    );

    card1.click();
    card2.click();

    expect(card1.classList.contains("matched")).toBe(true);
    expect(card2.classList.contains("matched")).toBe(true);
  });

  it("should not match two different cards", function (done) {
    const card1 = cards[0];
    const card2 = Array.from(cards).find(
      (card) => card.dataset.symbol !== card1.dataset.symbol
    );

    card1.click();
    card2.click();

    setTimeout(() => {
      expect(card1.classList.contains("hidden")).toBe(true);
      expect(card2.classList.contains("hidden")).toBe(true);
      expect(card1.textContent).toBe("");
      expect(card2.textContent).toBe("");
      done();
    }, 1000);
  });

  it("should not allow flipping already matched cards", function () {
    const card1 = cards[0];
    const card2 = Array.from(cards).find(
      (card) => card.dataset.symbol === card1.dataset.symbol
    );

    card1.click();
    card2.click();

    card1.click();
    expect(card1.textContent).toBe(card1.dataset.symbol); // Card remains matched
  });

  it("should show alert when all pairs are matched", function (done) {
    for (let i = 0; i < cards.length; i += 2) {
      cards[i].click();
      cards[i + 1].click();
    }

    setTimeout(() => {
      expect(alertSpy).toHaveBeenCalledWith("You won!");
      done();
    }, 300);
  });

  it("should reset the game when the restart button is clicked", function () {
    const card = cards[0];
    card.click();
    restartButton.click();

    expect(gameBoard.children.length).toBe(16); // Check if the game board is recreated
    expect(cards[0].classList.contains("hidden")).toBe(true); // Cards should be hidden again
  });
});
