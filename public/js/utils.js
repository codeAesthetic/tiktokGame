function Node(id, status) {
  this.id = id;
  this.status = status;
}

let prevTarget, target;
function startGame() {
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
}

// Handle Score update score according to move
const score = document.getElementById('myScore');
function resetScore(){
  score.setAttribute('value', 0);
  score.innerHTML = score.getAttribute('value');
}
function updateScore(board, success){
  if(success){
    score.setAttribute('value', +score.getAttribute('value') + board.rewardPt);
    // load next stage if user reaches passing Score
    console.log(score.getAttribute('value'), board.passingScore);
    if(score.getAttribute('value') >= board.passingScore){
      console.log("updateStage");
      board.updateStage();
    }
  } else {
    score.setAttribute('value', +score.getAttribute('value') - board?.deductionPt || 0);
  }
  score.innerHTML = score.getAttribute('value');
}
score.setAttribute('value', 0);
updateScore();

// remove wrong move animation image
function removeFailureImage(block){
  if(block) block.innerHTML = '';
}

function gridEventFunction(event) {
  const { target } = event;
  handleGridClick(target, this);
}

// if clicked on target increase score and remove target 
  // else deduct score according to config
function handleGridClick(grid, board) {
  // if clicked on target increase score and remove target 
  // else deduct score according to config
  if(grid?.className === 'target highlight'){
    updateScore(board, true);
    grid.className = 'target success';
  } else {
    updateScore(board);
    if(!grid.innerHTML){
      grid.innerHTML = '<div class="target failure"></div>';
    }
    const blockToRemove = grid.closest('td');
    setTimeout(() => {
      removeFailureImage(blockToRemove);
    }, 1000);
  }
}

function initGame(){
  const scoreContainer = document.querySelector(".scorewrapper");
  scoreContainer.style.display = 'flex';
  const mainFrame = document.querySelector(".mainFrame");
  mainFrame.style.display = 'block';
  const congratsWrapper = document.querySelector(".wrapper");
  congratsWrapper.style.display = 'none';
  updateScore();
}

function showModal(stage){
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
  if(stage) {
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