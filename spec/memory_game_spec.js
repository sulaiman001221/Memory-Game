const { setupDom } = require("../src/memory_game");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("Memory Game", () => {
  let gameBoard, restartButton, cards, dom, document, html;

  beforeEach(function () {
    html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    dom = new JSDOM(html);
    document = dom.window.document;
    setupDom(document);

    gameBoard = document.getElementById("game-board");
    restartButton = document.getElementById("restart-button");
    cards = gameBoard.querySelectorAll(".card");
  });

  it("should create a board with 16 hidden cards", () => {
    expect(cards.length).toBe(16);
    cards.forEach((card) => {
      expect(card.classList.contains("hidden")).toBeTrue();
    });
  });

  it("shuffle the cards each time a new game is started", () => {
    const initialOrder = Array.from(cards).map((card) => card.dataset.symbol);
    restartButton.click();
    const newOrder = Array.from(document.querySelectorAll(".card")).map(
      (card) => card.dataset.symbol
    );
    expect(newOrder).not.toEqual(initialOrder);
  });
});
