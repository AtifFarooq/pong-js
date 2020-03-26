// Select the canvas HTML element
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// create the user paddle
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    colour: "WHITE",
    score: 0
}

// create the computer paddle
const comp = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    colour: "WHITE",
    score: 0
}

// create the ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    colour: "RED"
}

// create the net
const net = {
    x: canvas.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    colour: "WHITE"
}

// draw a rectangle
function drawRect(x, y, w, h, colour) {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, w, h);    
}

// draw a net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.colour);
    }
}

// draw a circle
function drawCircle(x, y, r, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// draw Text
function drawText(text, x, y, colour) {
    ctx.fillStyle = colour;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

// rener the game
function render() {
    // clear the canvas & render a blank canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    // draw the net
    drawNet();

    // draw scores for user and computer
    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
    drawText(comp.score, 3 * (canvas.width/4), canvas.height/5, "WHITE");

    // draw user and computer paddles
    drawRect(user.x, user.y, user.width, user.height, user.colour);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.colour);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.colour);

}

// contol the user's paddle
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - user.height/2 - rect.top;
}

// collission detection
function collission(ball, paddle) {
    ball.top = ball.y - ball.radius,
    ball.bottom = ball.y + ball.radius,
    ball.left = ball.x - ball.radius,
    ball.right = ball.x + ball.radius

    paddle.top = paddle.y,
    paddle.bottom = paddle.y + paddle.height,
    paddle.left = paddle.x,
    paddle.right = paddle.x + paddle.width
    
    return ball.right > paddle.left && ball.top < paddle.bottom 
    && ball.left < paddle.right && ball.bottom > paddle.top;
}

function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// update the positions, score etc.
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // invert the polarity of velocity if the ball goes beyond the canvas
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // AI to control the computer paddle
    const computerLevel = 0.1;
    comp.y += (ball.y - (comp.y + comp.height/2)) * computerLevel;

    let player = (ball.x < canvas.width / 2) ? user : comp;

    // Adjust the polarity of velocityX if there is a collision
    if (collission(ball, player)) {
        // ball.velocityX = -ball.velocityX;
        // y-difference between the center of paddle & where ball hits
        // gives us a value between 0-50 (half of the paddle height)
        let collidePoint = ball.y - (player.y + player.height/2);

        // normalize between 0-1
        collidePoint = collidePoint / (player.height/2);

        // calculate angle in radians
        let angleRadian = collidePoint * (Math.PI/4);

        // X direction of the ball when it is hit
        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        // change velocityX and velocityY
        ball.velocityX = direction * ball.speed * Math.cos(angleRadian);
        ball.velocityY = ball.speed * Math.sin(angleRadian);

        // increase ball speed each time it hits a paddle
        ball.speed += 0.5;
    }

    // update the score
    if (ball.x - ball.radius < 0) {
        // the computer scores
        comp.score++;
        resetBall();
    } else if ((ball.x + ball.radius) > canvas.width) {
        // the player scores
        user.score++;
        resetBall();
    }
}

function gameInit() {
    update();
    render();
}

// loop the game
const framesPerSecond = 50;
setInterval(gameInit, 1000/framesPerSecond);