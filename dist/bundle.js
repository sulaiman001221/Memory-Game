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

eval("var symbols = [\"🍎\", \"🍌\", \"🍇\", \"🍒\", \"🍍\", \"🍉\", \"🍓\", \"🍑\"];\nfunction shuffle(array) {\n  for (var i = array.length - 1; i > 0; i--) {\n    var j = Math.floor(Math.random() * (i + 1));\n    var _ref = [array[j], array[i]];\n    array[i] = _ref[0];\n    array[j] = _ref[1];\n  }\n  return array;\n}\nfunction createBoard(document, gameBoard, cards, flipCardFn) {\n  var cardSymbols = shuffle([].concat(symbols, symbols));\n  cardSymbols.forEach(function (symbol) {\n    var card = document.createElement(\"div\");\n    card.classList.add(\"hidden\", \"card\");\n    card.dataset.symbol = symbol;\n    card.addEventListener(\"click\", function () {\n      return flipCardFn(card);\n    });\n    gameBoard.appendChild(card);\n    cards.push(card);\n  });\n}\nfunction flipCard(card, gameState, checkMatchFn) {\n  if (card.classList.contains(\"matched\") || card === gameState.firstCard || gameState.secondCard) {\n    return;\n  }\n  card.classList.remove(\"hidden\");\n  card.textContent = card.dataset.symbol;\n  if (!gameState.firstCard) {\n    gameState.firstCard = card;\n  } else if (!gameState.secondCard) {\n    gameState.secondCard = card;\n    checkMatchFn();\n  }\n}\nfunction checkMatch(gameState, matchedPairs, symbols, displayWinMessage, resetFlippedCardsFn) {\n  var firstCard = gameState.firstCard,\n    secondCard = gameState.secondCard;\n  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {\n    firstCard.classList.add(\"matched\");\n    secondCard.classList.add(\"matched\");\n    matchedPairs.value += 1;\n    if (matchedPairs.value === symbols.length) {\n      setTimeout(function () {\n        displayWinMessage();\n      }, 500);\n    }\n    resetFlippedCardsFn(gameState);\n  } else {\n    setTimeout(function () {\n      firstCard.classList.add(\"hidden\");\n      secondCard.classList.add(\"hidden\");\n      firstCard.textContent = \"\";\n      secondCard.textContent = \"\";\n      resetFlippedCardsFn(gameState);\n    }, 1000);\n  }\n}\nfunction setupDom(document) {\n  var winPopupMessage = document.querySelector(\".win-popup-message\");\n  var container = document.querySelector(\".container\");\n  var gameBoard = document.querySelector(\"#game-board\");\n  var startButton = document.querySelector(\"#start-button\");\n  var gameStarted = false;\n  var cards = [];\n  var gameState = {\n    firstCard: null,\n    secondCard: null\n  };\n  var matchedPairs = {\n    value: 0\n  };\n  var displayWinMessage = function displayWinMessage() {\n    winPopupMessage.style.display = \"block\";\n    container.classList.remove(\"fully-bright-container\");\n  };\n  var resetFlippedCards = function resetFlippedCards(gameState) {\n    gameState.firstCard = null;\n    gameState.secondCard = null;\n  };\n  var startGame = function startGame() {\n    gameBoard.innerHTML = \"\";\n    matchedPairs.value = 0;\n    gameState.firstCard = null;\n    gameState.secondCard = null;\n    cards = [];\n    createBoard(document, gameBoard, cards, function (card) {\n      return flipCard(card, gameState, function () {\n        return checkMatch(gameState, matchedPairs, symbols, displayWinMessage, resetFlippedCards);\n      });\n    });\n  };\n  startButton.addEventListener(\"click\", function () {\n    gameStarted = true;\n    document.querySelector(\".start-game-message\").style.display = \"none\";\n    container.classList.add(\"fully-bright-container\");\n    cards.forEach(function (card) {\n      return card.classList.remove(\"disabled\");\n    });\n  });\n  document.querySelector(\"#play-again-button\").addEventListener(\"click\", function () {\n    startGame();\n    winPopupMessage.style.display = \"none\";\n    container.classList.add(\"fully-bright-container\");\n  });\n  createBoard(document, gameBoard, cards, function (card) {\n    return flipCard(card, gameState, function () {\n      return checkMatch(gameState, matchedPairs, symbols, displayWinMessage, resetFlippedCards);\n    });\n  });\n  cards.forEach(function (card) {\n    return card.classList.add(\"disabled\");\n  });\n}\nif (typeof document !== \"undefined\") {\n  document.addEventListener(\"DOMContentLoaded\", function () {\n    setupDom(document);\n  });\n}\nmodule.exports = {\n  setupDom: setupDom,\n  shuffle: shuffle,\n  createBoard: createBoard,\n  flipCard: flipCard,\n  checkMatch: checkMatch\n};\n\n//# sourceURL=webpack://sulaiman-ndlovu-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

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