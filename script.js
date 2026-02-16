let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let currentLevel = 'easy';
let currentPlayer = "X"; // User is always X
const statusText = document.getElementById('status');

function startGame(level) {
    currentLevel = level;
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    
    // Reset Board UI
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    statusText.innerText = "Your Turn (X)";
    
    // Switch Screens
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function handleCellClick(index) {
    if (gameState[index] !== "" || !gameActive || currentPlayer !== "X") return;

    makeMove(index, "X");

    if (gameActive) {
        currentPlayer = "O";
        statusText.innerText = "Computer is thinking...";
        setTimeout(aiMove, 600);
    }
}

function aiMove() {
    let move;
    const available = gameState.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (available.length === 0 || !gameActive) return;

    if (currentLevel === 'hard') {
        move = findBestMove("O") || findBestMove("X") || available[Math.floor(Math.random() * available.length)];
    } else {
        move = available[Math.floor(Math.random() * available.length)];
    }

    makeMove(move, "O");
    if (gameActive) {
        currentPlayer = "X";
        statusText.innerText = "Your Turn (X)";
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    const cell = document.getElementById(`c${index}`);
    
    // Add span for animation
    const span = document.createElement('span');
    span.innerText = player;
    span.style.color = player === "X" ? "var(--pale-orange)" : "var(--pale-pink)";
    cell.appendChild(span);

    checkWinner();
}

function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let combo of wins) {
        const [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            statusText.innerText = gameState[a] === "X" ? "You Won! 🎉" : "Computer Won! 🤖";
            gameActive = false;
            return;
        }
    }
    if (!gameState.includes("")) {
        statusText.innerText = "It's a Draw! 🤝";
        gameActive = false;
    }
}

function findBestMove(p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let combo of wins) {
        const vals = combo.map(i => gameState[i]);
        if (vals.filter(v => v === p).length === 2 && vals.includes("")) {
            return combo[vals.indexOf("")];
        }
    }
    return null;
}

function backToMenu() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}