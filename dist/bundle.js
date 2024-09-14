/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/memory_game.js":
/*!****************************!*\
  !*** ./src/memory_game.js ***!
  \****************************/
/***/ ((module) => {

eval("var symbols = [\"🍎\", \"🍌\", \"🍇\", \"🍒\", \"🍍\", \"🍉\", \"🍓\", \"🍑\"];\nvar winPopupMessage, container, gameBoard, startButton, restartButton, createBoard, startGameMessage;\nvar cards = [];\nvar firstCard = null;\nvar secondCard = null;\nvar matchedPairs = 0;\nfunction setupDom(document) {\n  winPopupMessage = document.querySelector(\".win-popup-message\");\n  container = document.querySelector(\".container\");\n  gameBoard = document.querySelector(\"#game-board\");\n  startButton = document.querySelector(\"#start-button\");\n  restartButton = document.querySelector(\"#restart-button\");\n  playAgainButton = document.querySelector(\"#play-again-button\");\n  startGameMessage = document.querySelector(\".start-game-message\");\n  setStartButtonClickEvent();\n  setRestartButtonClickEvent();\n  setPlayAgainButtonClickEvent();\n  createBoard = function createBoard() {\n    if (!gameBoard) return;\n    var cardSymbols = shuffle([].concat(symbols, symbols));\n    cardSymbols.forEach(function (symbol) {\n      var newCard = document.createElement(\"div\");\n      newCard.classList.add(\"hidden\", \"card\");\n      newCard.dataset.symbol = symbol;\n      newCard.addEventListener(\"click\", function () {\n        flipCard(newCard);\n        displayRestartButton();\n      });\n      gameBoard.appendChild(newCard);\n      cards.push(newCard);\n      disableCards();\n    });\n  };\n}\nfunction setStartButtonClickEvent() {\n  startButton.addEventListener(\"click\", function () {\n    enableCards();\n    startGameMessage.style.display = \"none\";\n    container.classList.add(\"fully-bright-container\");\n  });\n}\nfunction setRestartButtonClickEvent() {\n  restartButton.addEventListener(\"click\", function () {\n    startGame();\n    startGameMessage.style.display = \"block\";\n    container.classList.remove(\"fully-bright-container\");\n    restartButton.style.display = \"none\";\n  });\n}\nfunction setPlayAgainButtonClickEvent() {\n  playAgainButton.addEventListener(\"click\", function () {\n    startGame();\n    winPopupMessage.style.display = \"none\";\n    startGameMessage.style.display = \"block\";\n  });\n}\nfunction shuffle(array) {\n  for (var i = array.length - 1; i > 0; i--) {\n    var j = Math.floor(Math.random() * (i + 1));\n    var _ref = [array[j], array[i]];\n    array[i] = _ref[0];\n    array[j] = _ref[1];\n  }\n  return array;\n}\nfunction disableCards() {\n  cards.forEach(function (card) {\n    card.classList.add(\"disabled\");\n  });\n}\nfunction enableCards() {\n  cards.forEach(function (card) {\n    card.classList.remove(\"disabled\");\n  });\n}\nfunction flipCard(card) {\n  if (card.classList.contains(\"matched\") || card === firstCard || secondCard) {\n    return;\n  }\n  card.classList.remove(\"hidden\");\n  card.textContent = card.dataset.symbol;\n  if (!firstCard) {\n    firstCard = card;\n  } else if (!secondCard) {\n    secondCard = card;\n    checkMatch();\n  }\n}\nfunction displayRestartButton() {\n  if (restartButton.style.display !== \"block\" && matchedPairs !== symbols.length) {\n    restartButton.style.display = \"block\";\n  }\n}\nfunction checkMatch() {\n  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {\n    firstCard.classList.add(\"matched\");\n    secondCard.classList.add(\"matched\");\n    matchedPairs += 1;\n    displayWinMessage();\n    resetFlippedCards();\n  } else {\n    setTimeout(function () {\n      firstCard.classList.add(\"hidden\");\n      secondCard.classList.add(\"hidden\");\n      firstCard.textContent = \"\";\n      secondCard.textContent = \"\";\n      resetFlippedCards();\n    }, 1000);\n  }\n}\nfunction displayWinMessage() {\n  if (matchedPairs === symbols.length) {\n    setTimeout(function () {\n      restartButton.style.display = \"none\";\n      winPopupMessage.style.display = \"block\";\n      container.classList.remove(\"fully-bright-container\");\n    }, 500);\n  }\n}\nfunction resetFlippedCards() {\n  firstCard = null;\n  secondCard = null;\n}\nfunction startGame() {\n  gameBoard.innerHTML = \"\";\n  matchedPairs = 0;\n  firstCard = null;\n  secondCard = null;\n  cards = [];\n  createBoard();\n}\nif (typeof document !== \"undefined\") {\n  document.addEventListener(\"DOMContentLoaded\", function () {\n    setupDom(document);\n    createBoard();\n  });\n}\nmodule.exports = {\n  setupDom: setupDom,\n  startGame: startGame\n};\n\n//# sourceURL=webpack://sulaiman-ndlovu-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/memory_game.js");
/******/ 	
/******/ })()
;