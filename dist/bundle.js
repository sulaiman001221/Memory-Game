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

eval("var symbols = [\"🍎\", \"🍌\", \"🍇\", \"🍒\", \"🍍\", \"🍉\", \"🍓\", \"🍑\"];\nvar winPopupMessage, container, gameBoard, startButton, restartButton, createBoard;\nvar setupDom = function setupDom(document) {\n  winPopupMessage = document.querySelector(\".win-popup-message\");\n  container = document.querySelector(\".container\");\n  gameBoard = document.querySelector(\"#game-board\");\n  startButton = document.querySelector(\"#start-button\");\n  restartButton = document.querySelector(\"#restart-button\");\n  startButton.addEventListener(\"click\", function () {\n    enableCards();\n    var startGameMessage = document.querySelector(\".start-game-message\");\n    startGameMessage.style.display = \"none\";\n    container.classList.add(\"fully-bright-container\");\n    restartButton.style.display = \"block\";\n  });\n  restartButton.addEventListener(\"click\", function () {\n    startGame();\n  });\n  var playAgainButton = document.querySelector(\"#play-again-button\");\n  playAgainButton.addEventListener(\"click\", function () {\n    startGame();\n    winPopupMessage.style.display = \"none\";\n    container.classList.add(\"fully-bright-container\");\n    restartButton.style.display = \"block\";\n  });\n  createBoard = function createBoard() {\n    if (!gameBoard) return;\n    var cardSymbols = shuffle([].concat(symbols, symbols));\n    cardSymbols.forEach(function (symbol) {\n      var newCard = document.createElement(\"div\");\n      newCard.classList.add(\"hidden\", \"card\");\n      newCard.dataset.symbol = symbol;\n      newCard.addEventListener(\"click\", function () {\n        return flipCard(newCard);\n      });\n      gameBoard.appendChild(newCard);\n      cards.push(newCard);\n    });\n  };\n};\nvar cards = [];\nvar firstCard = null;\nvar secondCard = null;\nvar matchedPairs = 0;\nfunction shuffle(array) {\n  for (var i = array.length - 1; i > 0; i--) {\n    var j = Math.floor(Math.random() * (i + 1));\n    var _ref = [array[j], array[i]];\n    array[i] = _ref[0];\n    array[j] = _ref[1];\n  }\n  return array;\n}\nfunction disableCards() {\n  cards.forEach(function (card) {\n    card.classList.add(\"disabled\");\n  });\n}\nfunction enableCards() {\n  cards.forEach(function (card) {\n    card.classList.remove(\"disabled\");\n  });\n}\nfunction flipCard(card) {\n  if (card.classList.contains(\"matched\") || card === firstCard || secondCard) {\n    return;\n  }\n  card.classList.remove(\"hidden\");\n  card.textContent = card.dataset.symbol;\n  if (!firstCard) {\n    firstCard = card;\n  } else if (!secondCard) {\n    secondCard = card;\n    checkMatch(firstCard, secondCard);\n  }\n}\nfunction checkMatch(card1, card2) {\n  if (card1.dataset.symbol === card2.dataset.symbol) {\n    card1.classList.add(\"matched\");\n    card2.classList.add(\"matched\");\n    matchedPairs += 1;\n    displayWinMessage(matchedPairs, symbols);\n    resetFlippedCards();\n  } else {\n    setTimeout(function () {\n      card1.classList.add(\"hidden\");\n      card2.classList.add(\"hidden\");\n      card1.textContent = \"\";\n      card2.textContent = \"\";\n      resetFlippedCards();\n    }, 1000);\n  }\n}\nfunction displayWinMessage(matched, allSymbols) {\n  if (matched === allSymbols.length) {\n    setTimeout(function () {\n      restartButton.style.display = \"none\";\n      winPopupMessage.style.display = \"block\";\n      container.classList.remove(\"fully-bright-container\");\n    }, 500);\n  }\n}\nfunction resetFlippedCards() {\n  firstCard = null;\n  secondCard = null;\n}\nfunction startGame() {\n  gameBoard.innerHTML = \"\";\n  matchedPairs = 0;\n  firstCard = null;\n  secondCard = null;\n  cards = [];\n  createBoard();\n}\nif (typeof document !== \"undefined\") {\n  document.addEventListener(\"DOMContentLoaded\", function () {\n    setupDom(document);\n    createBoard();\n    disableCards();\n  });\n}\nmodule.exports = {\n  setupDom: setupDom,\n  checkMatch: checkMatch,\n  startGame: startGame,\n  displayWinMessage: displayWinMessage\n};\n\n//# sourceURL=webpack://sulaiman-ndlovu-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

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