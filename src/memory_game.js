const setupDom = (document) => {
  const symbols = ["🍎", "🍌", "🍇", "🍒", "🍍", "🍉", "🍓", "🍑"];
  let gameBoard = document.getElementById("game-board");
  let restartButton = document.getElementById("restart-button");
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let matchedPairs = 0;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createBoard() {
    const cardSymbols = shuffle([...symbols, ...symbols]);
    cardSymbols.forEach((symbol) => {
      let card = document.createElement("div");
      card.classList.add("card", "hidden");
      card.dataset.symbol = symbol;
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
      cards.push(card);
    });
  }

  function flipCard(card) {
    if (
      card.classList.contains("matched") ||
      card === firstCard ||
      secondCard
    ) {
      return;
    }
    card.classList.remove("hidden");
    card.textContent = card.dataset.symbol;

    if (!firstCard) {
      firstCard = card;
    } else if (!secondCard) {
      secondCard = card;
      checkMatch();
    }
  }

  function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matchedPairs += 1;
      if (matchedPairs === symbols.length) {
        setTimeout(() => alert("You won!"), 300);
      }
      resetFlippedCards();
    } else {
      setTimeout(() => {
        firstCard.classList.add("hidden");
        secondCard.classList.add("hidden");
        firstCard.textContent = "";
        secondCard.textContent = "";
        resetFlippedCards();
      }, 1000);
    }
  }

  function resetFlippedCards() {
    firstCard = null;
    secondCard = null;
  }

  function restartGame() {
    gameBoard.innerHTML = "";
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    cards = [];
    createBoard();
  }

  restartButton.addEventListener("click", restartGame);
  createBoard();
};

if (typeof document === undefined) {
  document.addEventListener("DOMContentLoaded", () => {
    setupDom(document);
  });
}

module.exports = { setupDom };
