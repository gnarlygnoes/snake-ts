var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var tile_size = 30;
var time = 0;
var playerAlive = true;
var block = false;
var score = 0;
var GameState;
(function (GameState) {
    GameState[GameState["active"] = 0] = "active";
    GameState[GameState["collided"] = 1] = "collided";
    GameState[GameState["paused"] = 2] = "paused";
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
//let pos = {
//  x: 0,
//  y: 0,
//}
var pRect = [{
        x: 0,
        y: 0,
        w: tile_size,
        h: tile_size,
    }];
var fps = 0;
var dt = 0;
var current = performance.now();
var last = performance.now();
var elapsed = 0;
var speed = 0.25;
var level = 1;
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
        for (var i = pRect.length - 1; i > 0; i--) {
            pRect[i].x = pRect[i - 1].x;
            pRect[i].y = pRect[i - 1].y;
        }
        pRect[0].x += tile_size * direction.x;
        pRect[0].y += tile_size * direction.y;
        elapsed = 0;
        block = false;
        if (pRect[0].x === food.x && pRect[0].y === food.y) {
            food = foodpos();
            pRect.push({ x: pRect[pRect.length - 1].x, y: pRect[pRect.length - 1].y, w: tile_size, h: tile_size });
            //console.log(pRect.length)
            score++;
            level = setLevel(score);
            speed = setSpeed(level);
        }
        // let i = pRect.length - 1
        if (pRect[0].x >= cWidth || pRect[0].x < 0 || pRect[0].y < 0 || pRect[0].y >= cHeight) {
            state = GameState.collided;
        }
        for (var i = 4; i < pRect.length; i++) {
            if (pRect[0].x == pRect[i].x && pRect[0].y == pRect[i].y) {
                state = GameState.collided;
            }
        }
    }
    //console.log("speed: " + speed)
    //console.log("level: " + level)
}
update();
window.addEventListener("keypress", function (event) {
    //console.log(event)
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
    if (event.key === "p" && state === GameState.active) {
        state = GameState.paused;
    }
    else if (event.key === "p" && state === GameState.paused) {
        state = GameState.active;
    }
});
function setLevel(score) {
    if (score < 5) {
        return 1;
    }
    else if (score < 10) {
        return 2;
    }
    else if (score < 15) {
        return 3;
    }
    else if (score < 20) {
        return 4;
    }
    else if (score < 25) {
        return 5;
    }
    else if (score < 30) {
        return 6;
    }
    else if (score < 40) {
        return 7;
    }
    else {
        return 8;
    }
}
function setSpeed(level) {
    switch (level) {
        case 1:
            return 0.25;
        case 2:
            return .2;
        case 3:
            return .15;
        case 4:
            return .12;
        case 5:
            return .1;
        case 6:
            return .08;
        case 7:
            return .06;
        case 8:
            return .04;
    }
    return .04;
}
function initGame() {
    pRect[0].x = 0; // = { x: 0, y: 0 }
    pRect[0].y = 0;
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
        c.fillRect(0, 0, cWidth, cHeight);
        c.fillStyle = "yellow";
        for (var i = 1; i < pRect.length; i++) {
            c.fillRect(pRect[i].x, pRect[i].y, tile_size, tile_size);
        }
        c.fillStyle = "orange";
        c.fillRect(pRect[0].x, pRect[0].y, tile_size, tile_size);
        c.fillStyle = "red";
        c.fillRect(food.x, food.y, tile_size, tile_size);
        c.fillStyle = "blue";
        c.font = "36px serif";
        c.fillText("Score: " + score, 20, cHeight - 20);
        c.fillText("Level: " + level, cWidth - 135, cHeight - 20);
    }
    else if (state === GameState.collided) {
        c.fillStyle = "black";
        c.fillRect(0, 0, cWidth, cHeight);
        c.fillStyle = "red";
        c.font = "36px serif";
        c.fillText("After slith'ring off, you return hungry", 150, 200);
        c.fillText("Final Score: " + score, 150, 300);
        c.fillText("Press Enter to begin again", 150, 400);
        // console.log(state)
    }
    else if (state === GameState.paused) {
        c.fillStyle = "black";
        c.fillRect(0, 0, cWidth, cHeight);
        c.fillStyle = "white";
        c.font = "36px serif";
        c.fillText("GAME PAUSED", 310, 300);
    }
}
