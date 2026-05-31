const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const LS_BEST = "breakout_highscore";
const LS_ATTEMPTS = "breakout_attempts";

let highScore = parseInt(localStorage.getItem(LS_BEST) || "0");
let attempts = parseInt(localStorage.getItem(LS_ATTEMPTS) || "0");
let score = 0;

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2.5;
let dy = -2.5;
const ballRadius = 8;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;
let gameOver = false;

// --- UI elements (add these IDs to your HTML) ---
const uiScore = document.getElementById("ui-score");
const uiBest = document.getElementById("ui-best");
const uiAttempts = document.getElementById("ui-attempts");

function renderStats() {
  uiBest.textContent = highScore;
  uiAttempts.textContent = attempts;
  uiScore.textContent = score;
}

renderStats();

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "Right") rightPressed = true;
  if (e.key === "ArrowLeft" || e.key === "Left") leftPressed = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight" || e.key === "Right") rightPressed = false;
  if (e.key === "ArrowLeft" || e.key === "Left") leftPressed = false;
});

canvas.addEventListener("click", () => {
  if (gameOver) resetGame();
});

function resetGame() {
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  dx = 2.5;
  dy = -2.5;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  gameOver = false;
  renderStats();
  requestAnimationFrame(draw);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawOverlay() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(`Score: ${score}  |  Best: ${highScore}  |  Attempts: ${attempts}`, canvas.width / 2, canvas.height / 2 + 15);
  ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 2 + 45);
  ctx.textAlign = "left";
}

function draw() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();

  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
  if (ballY + dy < ballRadius) {
    dy = -dy;
  } else if (ballY + dy > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      dy = -dy;
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem(LS_BEST, highScore);
      }
      renderStats();
    } else {
      // Ball missed — count the attempt and show game over
      gameOver = true;
      attempts++;
      localStorage.setItem(LS_ATTEMPTS, attempts);
      renderStats();
      drawOverlay();
      return;
    }
  }

  ballX += dx;
  ballY += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  requestAnimationFrame(draw);
}

draw();
