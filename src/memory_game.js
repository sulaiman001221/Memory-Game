const symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard(document, gameBoard, cards, flipCardFn) {
  const cardSymbols = shuffle([...symbols, ...symbols]);
  cardSymbols.forEach((symbol) => {
    let card = document.createElement("div");
    card.classList.add("hidden", "card");
    card.dataset.symbol = symbol;
    card.addEventListener("click", () => flipCardFn(card));
    gameBoard.appendChild(card);
    cards.push(card);
  });
}

function flipCard(card, gameState, checkMatchFn) {
  if (
    card.classList.contains("matched") ||
    card === gameState.firstCard ||
    gameState.secondCard
  ) {
    return;
  }
  card.classList.remove("hidden");
  card.textContent = card.dataset.symbol;

  if (!gameState.firstCard) {
    gameState.firstCard = card;
  } else if (!gameState.secondCard) {
    gameState.secondCard = card;
    checkMatchFn();
  }
}

function checkMatch(
  gameState,
  matchedPairs,
  symbols,
  displayWinMessage,
  resetFlippedCardsFn
) {
  const { firstCard, secondCard } = gameState;
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs.value += 1;
    if (matchedPairs.value === symbols.length) {
      setTimeout(() => {
        displayWinMessage();
      }, 500);
    }
    resetFlippedCardsFn(gameState);
  } else {
    setTimeout(() => {
      firstCard.classList.add("hidden");
      secondCard.classList.add("hidden");
      firstCard.textContent = "";
      secondCard.textContent = "";
      resetFlippedCardsFn(gameState);
    }, 1000);
  }
}

function setupDom(document) {
  const winPopupMessage = document.querySelector(".win-popup-message");
  const container = document.querySelector(".container");
  let gameBoard = document.querySelector("#game-board");
  let startButton = document.querySelector("#start-button");
  let cards = [];
  let gameState = { firstCard: null, secondCard: null };
  let matchedPairs = { value: 0 };

  const displayWinMessage = () => {
    winPopupMessage.style.display = "block";
    container.classList.remove("fully-bright-container");
  };

  const resetFlippedCards = (gameState) => {
    gameState.firstCard = null;
    gameState.secondCard = null;
  };

  const startGame = () => {
    gameBoard.innerHTML = "";
    matchedPairs.value = 0;
    gameState.firstCard = null;
    gameState.secondCard = null;
    cards = [];
    createBoard(document, gameBoard, cards, (card) =>
      flipCard(card, gameState, () =>
        checkMatch(
          gameState,
          matchedPairs,
          symbols,
          displayWinMessage,
          resetFlippedCards
        )
      )
    );
  };

  startButton.addEventListener("click", () => {
    document.querySelector(".start-game-message").style.display = "none";
    container.classList.add("fully-bright-container");
    cards.forEach((card) => card.classList.remove("disabled"));
  });

  document.querySelector("#play-again-button").addEventListener("click", () => {
    startGame();
    winPopupMessage.style.display = "none";
    container.classList.add("fully-bright-container");
  });

  createBoard(document, gameBoard, cards, (card) =>
    flipCard(card, gameState, () =>
      checkMatch(
        gameState,
        matchedPairs,
        symbols,
        displayWinMessage,
        resetFlippedCards
      )
    )
  );
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupDom(document);
  });
}

module.exports = { setupDom, shuffle, createBoard, flipCard, checkMatch };
