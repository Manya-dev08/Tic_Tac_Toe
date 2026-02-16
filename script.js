let board = ["", "", "", "", "", "", "", "", ""];
let huPlayer = "X";
let aiPlayer = "O";
let difficulty = "moderate";
let isGameActive = false;
let autoResetInterval = null; 
let cpuThinkingTimeout = null;

function setSymbol(sym) {
    huPlayer = sym;
    aiPlayer = (sym === "X") ? "O" : "X";
    document.getElementById('btnX').classList.toggle('active', sym === 'X');
    document.getElementById('btnO').classList.toggle('active', sym === 'O');
}

function setDiff(lvl) {
    difficulty = lvl;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(lvl).classList.add('active');
}

function startGame() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initGame();
}

function backToMenu() {
    // KILL ALL PROCESSES
    isGameActive = false;
    clearInterval(autoResetInterval); 
    clearTimeout(cpuThinkingTimeout); 
    document.getElementById('timer').innerText = "";
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
}

function initGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    clearInterval(autoResetInterval);
    clearTimeout(cpuThinkingTimeout);
    document.getElementById('status').innerText = "YOUR TURN";
    document.getElementById('timer').innerText = "";
    
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for(let i=0; i<9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = () => handleCellClick(i);
        grid.appendChild(cell);
    }

    if (aiPlayer === 'X') {
        document.getElementById('status').innerText = "AI THINKING...";
        cpuThinkingTimeout = setTimeout(cpuMove, 800);
    }
}

function handleCellClick(i) {
    if (board[i] === "" && isGameActive) {
        board[i] = huPlayer;
        updateUI();
        if (checkWin(board, huPlayer)) return endGame("YOU WIN!");
        if (board.every(s => s !== "")) return endGame("DRAW!");
        
        isGameActive = false; 
        document.getElementById('status').innerText = "AI THINKING...";
        cpuThinkingTimeout = setTimeout(cpuMove, 600);
    }
}

function cpuMove() {
    if (!isGameActive && board.every(s => s !== "")) return;
    
    let move;
    const avail = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (difficulty === 'easy') {
        move = avail[Math.floor(Math.random() * avail.length)];
    } 
    else if (difficulty === 'moderate') {
        // 40% chance to make a random move, 60% chance to play perfectly
        move = (Math.random() < 0.4) ? avail[Math.floor(Math.random() * avail.length)] : minimax(board, aiPlayer).index;
    } 
    else {
        move = minimax(board, aiPlayer).index;
    }

    if (move !== undefined) {
        board[move] = aiPlayer;
        updateUI();
    }
    
    if (checkWin(board, aiPlayer)) {
        endGame("AI WINS!");
    } else if (board.every(s => s !== "")) {
        endGame("DRAW!");
    } else {
        isGameActive = true;
        document.getElementById('status').innerText = "YOUR TURN";
    }
}

function updateUI() {
    const cells = document.getElementsByClassName('cell');
    board.forEach((mark, i) => {
        if(mark !== "") {
            cells[i].innerText = mark;
            cells[i].classList.add(mark.toLowerCase());
        }
    });
}

function endGame(msg) {
    isGameActive = false;
    document.getElementById('status').innerText = msg;
    let count = 3;
    const timerBox = document.getElementById('timer');
    
    autoResetInterval = setInterval(() => {
        timerBox.innerText = `Auto-resetting in ${count}...`;
        if (count <= 0) {
            clearInterval(autoResetInterval);
            initGame();
        }
        count--;
    }, 1000);
}

function checkWin(b, p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(w => w.every(i => b[i] === p));
}

// Unbeatable Minimax Algorithm
function minimax(newBoard, player) {
    let avail = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (checkWin(newBoard, huPlayer)) return {score: -10};
    if (checkWin(newBoard, aiPlayer)) return {score: 10};
    if (avail.length === 0) return {score: 0};

    let moves = [];
    for (let i = 0; i < avail.length; i++) {
        let move = {index: avail[i]};
        newBoard[avail[i]] = player;
        move.score = minimax(newBoard, player === aiPlayer ? huPlayer : aiPlayer).score;
        newBoard[avail[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        moves.forEach((m, i) => { if (m.score > bestScore) { bestScore = m.score; bestMove = i; }});
    } else {
        let bestScore = 10000;
        moves.forEach((m, i) => { if (m.score < bestScore) { bestScore = m.score; bestMove = i; }});
    }
    return moves[bestMove];
}