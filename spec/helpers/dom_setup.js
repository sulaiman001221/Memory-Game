const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

function setupDom() {
  const html = fs.readFileSync(
    path.join(__dirname, "../../index.html"),
    "utf8"
  );
  const dom = new JSDOM(html);
  const window = dom.window;
  const document = dom.window.document;
  const gameBoard = document.getElementById("game-board");
  const startButton = document.getElementById("start-button");
  const winPopupMessage = document.querySelector(".win-popup-message");
  const container = document.querySelector(".container");
  const restartButton = document.getElementById("restart-button");
  const startGameMessage = document.querySelector(".start-game-message");

  return {
    document,
    window,
    gameBoard,
    startButton,
    winPopupMessage,
    container,
    restartButton,
    startGameMessage,
    dom,
  };
}

module.exports = { setupDom };
