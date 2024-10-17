// Game Variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let box = 20; // Size of each unit in the grid
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;
let playerName = prompt("Enter your name:");
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
let level = 1;
let gameInterval = null;
let timer = 0;
let timerInterval = null;

// Display Player Name and High Score
document.getElementById('playerName').innerText = `Player: ${playerName}`;
document.getElementById('highScore').innerText = highScore;

// Timer Function
function startTimer() {
    timer = 0;
    document.getElementById('timer').innerText = timer;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = timer;
    }, 1000);
}

// Game Functions
function draw() {
    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Check for food
    if (snakeX === food.x && snakeY === food.y) {
        currentScore++;
        document.getElementById('currentScore').innerText = currentScore;
        food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        if (currentScore % 5 === 0) {
            levelUp();
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game over conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        updateGameHistory();
        resetGame();
        return;
    }

    snake.unshift(newHead);
}

function collision(head, body) {
    for (let i = 0; i < body.length; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    currentScore = 0;
    level = 1;
    document.getElementById('currentScore').innerText = 0;
    document.getElementById('level').innerText = 1;
}

function levelUp() {
    level++;
    document.getElementById('level').innerText = level;
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 200 - level * 20);
}

function updateGameHistory() {
    gameHistory.push({ name: playerName, score: currentScore, time: timer });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    displayGameHistory();
}

function displayGameHistory() {
    let historyDiv = document.getElementById('gameHistory');
    historyDiv.innerHTML = '<h3>Game History</h3>';
    gameHistory.forEach(game => {
        historyDiv.innerHTML += `<p>${game.name} - Score: ${game.score}, Time: ${game.time}s</p>`;
    });
}

// Control snake direction
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Start game button
document.getElementById('startGame').addEventListener('click', () => {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startTimer();
    gameInterval = setInterval(draw, 200);
});

// Display history on page load
displayGameHistory();
