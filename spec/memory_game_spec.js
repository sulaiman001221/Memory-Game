const { setupDom, shuffle } = require("../src/memory_game");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("Memory Game", () => {
  let gameBoard, startButton, cards, dom, document, html;

  beforeEach(function () {
    html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    dom = new JSDOM(html);
    document = dom.window.document;
    setupDom(document);

    gameBoard = document.getElementById("game-board");
    startButton = document.getElementById("start-button");
    cards = gameBoard.querySelectorAll(".card");
  });

  it("should create a board with 16 hidden cards", () => {
    expect(cards.length).toBe(16);
    cards.forEach((card) => {
      expect(card.classList.contains("hidden")).toBeTrue();
    });
  });

  it("shuffle the cards each time a new game is started", () => {
    const mockFunction = {
      shuffle: shuffle(),
    };
    spyOn(mockFunction, shuffle);
    startButton.click();
    expect(mockFunction.shuffle).toHaveBeenCalled();
  });

  // it("should flip a hidden card when clicked", () => {
  //   const card = cards[0];
  //   expect(card.classList.contains("hidden")).toBe(true);
  //   const flipCardSpy = spyOn(card, "click").and.callThrough();
  //   card.click();
  //   expect(flipCardSpy).toHaveBeenCalled();
  //   expect(card.classList.contains("hidden")).toBe(false);
  //   expect(card.textContent).toBe(card.dataset.symbol);
  // });

  // it("should not flip a card that has already been flipped", () => {
  //   const card = cards[0];
  //   card.click();
  //   expect(card.classList.contains("hidden")).toBe(false);
  //   expect(card.textContent).toBe(card.dataset.symbol);
  //   card.click();
  //   expect(card.classList.contains("hidden")).toBe(false);
  //   expect(card.textContent).toBe(card.dataset.symbol);
  // });

  it("should match the cards if cards of similar symbols are opened", () => {});
});
