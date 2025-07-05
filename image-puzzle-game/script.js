const puzzle = document.getElementById("puzzle");
const moveCounter = document.getElementById("moveCounter");
const timerDisplay = document.getElementById("timer");
const uploadImage = document.getElementById("uploadImage");

const size = 3;
let tiles = [];
let moveCount = 0;
let timer = 0;
let timerInterval;
let backgroundImage = "images/puzzle.jpg";

uploadImage.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      backgroundImage = event.target.result;
      createTiles();
    };
    reader.readAsDataURL(file);
  }
});

function createTiles() {
  tiles = [];
  for (let i = 0; i < size * size - 1; i++) {
    tiles.push(i);
  }
  tiles.push(null);
  shuffleTiles();
}

function shuffleTiles() {
  moveCount = 0;
  moveCounter.innerText = moveCount;
  timer = 0;
  timerDisplay.innerText = timer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.innerText = timer;
  }, 1000);

  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  render();
}

function render() {
  puzzle.innerHTML = "";
  tiles.forEach((val, index) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    if (val === null) {
      tile.classList.add("empty");
    } else {
      let row = Math.floor(val / size);
      let col = val % size;
      tile.style.backgroundImage = `url('${backgroundImage}')`;
      tile.style.backgroundPosition = `-${col * 150}px -${row * 150}px`;
      tile.addEventListener("click", () => moveTile(index));
    }

    puzzle.appendChild(tile);
  });
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const validMoves = [index - 1, index + 1, index - size, index + size];

  if (
    (index % size === 0 && emptyIndex === index - 1) ||
    (index % size === size - 1 && emptyIndex === index + 1)
  ) return;

  if (validMoves.includes(emptyIndex)) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    moveCount++;
    moveCounter.innerText = moveCount;
    render();
    checkWin();
  }
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i) return;
  }
  if (tiles[tiles.length - 1] === null) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`🎉 ජය! ඔබ ${moveCount} චලනයන් හා ${timer} තත්පර වලින් විසඳා ඇත!`);
    }, 100);
  }
}

createTiles();