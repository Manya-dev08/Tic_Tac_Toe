let board = ["", "", "", "", "", "", "", "", ""];
let currentDifficulty = 'hard';
let gameActive = true;
const human = "X";
const ai = "O";

const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function startGame(level) {
    currentDifficulty = level;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('difficulty-label').innerText = `LEVEL: ${level.toUpperCase()}`;
    resetGame();
}

function backToMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    document.getElementById('status').innerText = "YOUR TURN";
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for(let i=0; i<9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => handleMove(i));
        grid.appendChild(cell);
    }
}

function handleMove(index) {
    if (board[index] === "" && gameActive) {
        makeMove(index, human);
        if (gameActive) {
            document.getElementById('status').innerText = "CPU THINKING...";
            setTimeout(cpuPlay, 500);
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cells = document.getElementsByClassName('cell');
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());
    if (checkWin(board, player)) {
        document.getElementById('status').innerText = `${player} WINS!`;
        gameActive = false;
    } else if (board.every(s => s !== "")) {
        document.getElementById('status').innerText = "DRAW!";
        gameActive = false;
    }
}

function cpuPlay() {
    let move;
    if (currentDifficulty === 'easy') {
        let avail = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        move = avail[Math.floor(Math.random() * avail.length)];
    } else if (currentDifficulty === 'moderate') {
        // Random 50/50 chance of being smart or dumb
        move = Math.random() > 0.5 ? minimax(board, ai).index : minimax(board, human).index; 
    } else {
        // Hard Mode: Minimax (Unbeatable)
        move = minimax(board, ai).index;
    }
    
    if (move !== undefined) makeMove(move, ai);
    if(gameActive) document.getElementById('status').innerText = "YOUR TURN";
}

function checkWin(b, p) {
    return winPatterns.some(pattern => pattern.every(i => b[i] === p));
}

function minimax(newBoard, player) {
    let availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWin(newBoard, human)) return {score: -10};
    if (checkWin(newBoard, ai)) return {score: 10};
    if (availSpots.length === 0) return {score: 0};

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === ai) move.score = minimax(newBoard, human).score;
        else move.score = minimax(newBoard, ai).score;

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === ai) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}