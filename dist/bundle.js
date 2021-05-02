/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"config":[{"row":5,"col":5,"rewardPt":10,"deductionPt":5,"highlightDuration":800,"passingScore":50},{"row":10,"col":10,"rewardPt":10,"deductionPt":5,"highlightDuration":600,"passingScore":100}]}');

/***/ })
/******/ 	]);
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { config } = __webpack_require__(1);

// remove wrong move animation image
function removeFailureImage(block) {
  if (block) block.innerHTML = '';
}

function initGame() {
  const scoreContainer = document.querySelector(".scorewrapper");
  scoreContainer.style.display = 'flex';
  const mainFrame = document.querySelector(".mainFrame");
  mainFrame.style.display = 'block';
  const congratsWrapper = document.querySelector(".wrapper");
  congratsWrapper.style.display = 'none';
}

function showModal(stage) {
  const congratsWrapper = document.querySelector(".wrapper");
  const scoreContainer = document.querySelector(".scorewrapper");
  const mainFrame = document.querySelector(".mainFrame");
  const modalHeader = document.querySelector('.modal-header');
  const modalSubHeader = document.querySelector('.modal-subheader');
  const restartBtn = document.getElementById('restartGame');
  const nextBtn = document.getElementById('nextBtn');
  mainFrame.style.display = 'none';
  scoreContainer.style.display = 'none';
  congratsWrapper.style.display = 'flex';
  if (stage) {
    modalHeader.innerHTML = 'Yeehhh!';
    modalSubHeader.innerHTML = `You completed Stage ${stage}`;
    nextBtn.style.display = 'block'
    restartBtn.style.display = 'none'
  } else {
    restartBtn.style.display = 'block'
    nextBtn.style.display = 'none'
    modalHeader.innerHTML = 'Congratulations!';
    modalSubHeader.innerHTML = `You have successfully completed the game`;
  }
}

const MAX_WIDTH = Math.floor(document.body.clientWidth / 110);
const MAX_HEIGHT = Math.floor(document.body.clientHeight / 80);
let stage = 0, gameInterval, gridEventHandler, failureImageTimeout;

// Board constructor with stage config.
function Board(stage) {
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
  for (let r = 0; r < this.row; r++) {
    let currentHTMLRow = `<tr id="row ${r}">`;
    for (let c = 0; c < this.col; c++) {
      let newNodeId = `${r}-${c}`;
      currentHTMLRow += `<td id="${newNodeId}" class="unvisited"></td>`;
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
  let prevTarget, target;
  gameInterval = setInterval(() => {
    const row = Math.floor(Math.random() * this.row);
    const col = Math.floor(Math.random() * this.col);
    // if prevTarget present remove highlight from it
    if (prevTarget) {
      prevTarget.innerHTML = '';
    }
    //get element and add target to that grid
    target = document.getElementById(`${row}-${col}`);
    target.innerHTML = '<div class="target highlight"></div>';
    prevTarget = target;
  }, this.highlightDuration);
}

// handle Add Event Listener on mousedown.
Board.prototype.addEventListener = function () {
  gridEventHandler = ({ target }) => {
    // if clicked on target increase score and remove target 
    // else deduct score according to config
    if (target?.className === 'target highlight') {
      this.updateScore(this.rewardPt);
      target.className = 'target success';
    } else {
      this.updateScore(-this.deductionPt);
      const blockToRemove = target.closest('td');
      blockToRemove.innerHTML = '<div class="target failure"></div>';
      failureImageTimeout = setTimeout(() => {
        removeFailureImage(blockToRemove);
      }, 1000);
    }
  }
  document.getElementById('board').addEventListener('mousedown', gridEventHandler);
}

// handle remove Event Listener on mousedown.
Board.prototype.removeEventListener = function () {
  document.getElementById('board').removeEventListener('mousedown', gridEventHandler)
}

//update stage when reach passing score for current stage.
Board.prototype.updateStage = function () {
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.removeEventListener('click', initGame);
  const data = config[++stage];
  // if reach last stage end game
  // else update config as per next stage
  if (stage >= config.length) {
    this.endGame();
  } else {
    this.showStageCompleteModal();
    nextBtn.addEventListener('click', initGame);
    this.row = Math.min(MAX_HEIGHT, data.row);
    this.col = Math.min(MAX_WIDTH, data.col);
    this.rewardPt = data.rewardPt;
    this.deductionPt = data.deductionPt;
    this.highlightDuration = data.highlightDuration;
    this.passingScore = data.passingScore;
    this.score = 0;
    this.createGrid();
    this.updateScore(0, true);
  }
}

//handle modal on Stage complete
Board.prototype.showStageCompleteModal = function () {
  showModal(stage);
}

// Show congratulation Screen on completing last stage.
Board.prototype.endGame = function () {
  //clear event listeners and hide main frame and show congrats page
  this.updateScore(0, true);
  this.removeEventListener();
  clearInterval(gameInterval);
  clearTimeout(failureImageTimeout);
  showModal();
  const restartBtn = document.getElementById('restartGame');
  restartBtn.addEventListener('click', loadGame);
}

Board.prototype.updateScore = function (score = 0, reset = false) {
  const scoreBoard = document.getElementById('myScore');
  if (reset) {
    scoreBoard.setAttribute('value', 0);
  }
  const updatedScore = (+scoreBoard.getAttribute('value') || 0) + score;
  scoreBoard.setAttribute('value', updatedScore);
  // load next stage if user reaches passing Score
  if (scoreBoard.getAttribute('value') >= this.passingScore) {
    this.updateStage();
  }
  scoreBoard.innerHTML = scoreBoard.getAttribute('value');
}

Board.prototype.initialize = function () {
  this.createGrid();
  this.updateScore();
  this.addEventListener();
  this.startGame();
}

function loadGame() {
  const restartBtn = document.getElementById('restartGame');
  restartBtn.removeEventListener('click', loadGame);
  initGame();
  stage = 0;
  let board = new Board(config[stage]);
  board.initialize();
}

loadGame()
})();

/******/ })()
;