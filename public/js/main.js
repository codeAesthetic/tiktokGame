const config = [
  {
    "row": 5,
    "col": 5,
    "rewardPt": 10,
    "deductionPt": 5,
    "highlightDuration": 800,
    "passingScore": 30,
  },
  {
    "row": 10,
    "col": 10,
    "rewardPt": 10,
    "deductionPt": 5,
    "highlightDuration": 600,
    "passingScore": 50,
  },
  {
    "row": 330,
    "col": 330,
    "rewardPt": 20,
    "deductionPt": 5,
    "highlightDuration": 400,
    "passingScore": 100,
  }
];

const MAX_WIDTH = Math.floor(document.body.clientWidth / 110);
const MAX_HEIGHT = Math.floor(document.body.clientHeight / 80);
let stage = 0, gameInterval;

// Board constructor with stage config.
function Board(stage) {
  this.id = stage.id;
  this.row = Math.min(MAX_HEIGHT, stage.row);
  this.col = Math.min(MAX_WIDTH, stage.col);
  this.rewardPt = stage.rewardPt;
  this.deductionPt = stage.deductionPt;
  this.highlightDuration = stage.highlightDuration;
  this.passingScore = stage.passingScore;
  this.score = 0;
}

Board.prototype.createGrid = function () {
  let tableHTML = "";
  console.log(this.row, this.col);
  for (let r = 0; r < this.row; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    for (let c = 0; c < this.col; c++) {
      let newNodeId = `${r}-${c}`;
      const newNodeClass = "unvisited";
      const newNode = new Node(newNodeId, newNodeClass);
      currentArrayRow.push(newNode);
      currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
    }
    tableHTML += `${currentHTMLRow}</tr>`;
  }
  const board = document.getElementById("board");
  const passingScore = document.getElementById("passingScore");
  board.innerHTML = tableHTML;
  passingScore.innerHTML = this.passingScore;
};

// highlight random Nodes.
Board.prototype.startGame = function () {
  gameInterval = setInterval(startGame.bind(this), this.highlightDuration);
}

// handle Add Event Listener on mousedown.
let gridEventHandler;
Board.prototype.addEventListener = function () {
  gridEventHandler = gridEventFunction.bind(this)
  document.getElementById('board').addEventListener('mousedown', gridEventHandler);
}

// handle remove Event Listener on mousedown.
Board.prototype.removeEventListener = function () {
  document.getElementById('board').removeEventListener('mousedown', gridEventHandler)
}

//update stage when reach passing score for current stage.
Board.prototype.updateStage = function () {
  const data = config[++stage];
  // if reach last stage end game
  // else update config as per next stage
  if(stage >= config.length){ 
    this.endGame();
  } else {
    this.showStageCompleteModal(this);
    this.id = data.id;
    this.row = Math.min(MAX_HEIGHT, data.row);
    this.col = Math.min(MAX_WIDTH, data.col);
    this.rewardPt = data.rewardPt;
    this.deductionPt = data.deductionPt;
    this.highlightDuration = data.highlightDuration;
    this.passingScore = data.passingScore;
    this.score = 0;
    this.createGrid();
    resetScore();
  }
}

//handle modal on Stage complete
Board.prototype.showStageCompleteModal = function () {
  showModal(stage, this);
}

// Show congratulation Screen on completing last stage.
Board.prototype.endGame = function () {
  //clear event listeners and hide main frame and show congrats page
  this.removeEventListener();
  clearInterval(gameInterval);
  showModal();
}

Board.prototype.initialize = function () {
  this.createGrid();
  this.addEventListener();
  this.startGame();
}

function loadGame(){
  initGame();
  stage = 0;
  let board = new Board(config[stage]);
  board.initialize();
}

loadGame()