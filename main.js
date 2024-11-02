var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var tile_size = 30;
var time = 0;
var speed = 1;
var playerAlive = true;
var block = false;
var score = 0;
var GameState;
(function (GameState) {
    GameState[GameState["active"] = 0] = "active";
    GameState[GameState["victorious"] = 1] = "victorious";
    GameState[GameState["collided"] = 2] = "collided";
    GameState[GameState["paused"] = 3] = "paused";
})(GameState || (GameState = {}));
var state = GameState.active;
var cWidth = tile_size * 30;
var cHeight = tile_size * 20;
canvas.width = cWidth;
canvas.height = cHeight;
var direction = {
    x: 1,
    y: 0,
};
var pos = {
    x: 0,
    y: 0,
};
var fps = 0;
var dt = 0;
var current = performance.now();
var last = performance.now();
var elapsed = 0;
var food = foodpos();
function update() {
    switch (state) {
        case GameState.active:
            gameLoop();
            break;
    }
    window.requestAnimationFrame(update);
    draw();
}
function gameLoop() {
    current = performance.now();
    dt = (current - last) * .001;
    last = current;
    elapsed += dt;
    // console.log(elapsed)
    if (elapsed > speed) {
        pos.x += tile_size * direction.x;
        pos.y += tile_size * direction.y;
        elapsed = 0;
        block = false;
        if (pos.x === food.x && pos.y === food.y) {
            food = foodpos();
            score++;
        }
        if (pos.x >= cWidth || pos.x < 0 || pos.y < 0 || pos.y >= cHeight) {
            state = GameState.collided;
        }
    }
    setSpeed();
    console.log(speed);
}
update();
window.addEventListener("keypress", function (event) {
    console.log(event);
    if (event.key === "j" && !block && direction.y == 0) {
        direction.y = 1;
        direction.x = 0;
        block = true;
    }
    if (event.key === "k" && !block && direction.y == 0) {
        direction.y = -1;
        direction.x = 0;
        block = true;
    }
    if (event.key === "h" && !block && direction.x == 0) {
        direction.x = -1;
        direction.y = 0;
        block = true;
    }
    if (event.key === "l" && !block && direction.x == 0) {
        direction.x = 1;
        direction.y = 0;
        block = true;
    }
    if (event.key === "Enter" && state !== GameState.active) {
        initGame();
        state = GameState.active;
    }
});
function setSpeed() {
    switch (score) {
        case 0:
            speed = 0.5;
            break;
        case 5:
            speed = .3;
            break;
        case 10:
            speed = .2;
            break;
        case 15:
            speed = .15;
            break;
        case 20:
            speed = .12;
            break;
        case 25:
            speed = .1;
            break;
    }
}
function initGame() {
    pos = { x: 0, y: 0 };
    direction = { x: 1, y: 0 };
    score = 0;
    elapsed = 0;
    food = foodpos();
}
function foodpos() {
    var food = {
        x: Math.floor(Math.random() * 30) * tile_size,
        y: Math.floor(Math.random() * 20) * tile_size,
    };
    return food;
}
function draw() {
    if (state === GameState.active) {
        c.fillStyle = "grey";
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "orange";
        c.fillRect(pos.x, pos.y, tile_size, tile_size);
        c.fillStyle = "red";
        c.fillRect(food.x, food.y, tile_size, tile_size);
    }
    else if (state === GameState.collided) {
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "red";
        c.font = "36px serif";
        c.fillText("CRASH! Hit Enter to start again", 200, 200);
        // console.log(state)
    }
}
