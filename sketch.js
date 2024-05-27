let snake;
let rez = 20;
let foodpos;
let w;
let h;
let score = 0;
let isGameRunning = false; //game state
let snakeColor = "#FFF806";
speed=8;
let foodImg;
let images = [];
let greenBlockPos = null;
let defaultSpeed = 8;
let slowSpeed = 6;
let isSlowedDown = false;
let slowDownTimer;


function preload() {
    let imgFolder = "img/";
    let imgFiles = ["apple.svg", "banana.svg", "orange.svg","cake.svg"]; // List your image files here

    for (let i = 0; i < imgFiles.length; i++) {
        images[i] = loadImage(imgFolder + imgFiles[i]);
    }
}

function setup() {
    createCanvas(1500, 1000);
    w = floor(width / rez);
    h = floor(height / rez);
    frameRate(speed); // speed

    // Prevent arrow keys from scrolling
    window.addEventListener('keydown', function(event) {
        if ([37, 38, 39, 40].includes(event.keyCode)) {
            event.preventDefault();
        }
    });
}


function startGame() {
    snake = new Snake(); // Initialize snake
    foodlocation(); // Place the first food
    score = 0;
    snakeColor = "#FFF806";
    frameRate(speed);
    document.getElementById('score').textContent = 'Score: ' + score;
    isGameRunning = true;
    loop(); // Start the draw loop
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('restart-button').style.display = 'block';
    document.querySelector('h1').textContent = "Good Luck!"; // Change or hide welcome message
}

function restartGame() {
    snake = new Snake(); // Reset snake
    foodlocation(); // Place new food
    score = 0;
    snakeColor = "#FFF806";
    frameRate(speed);
    document.getElementById('score').textContent = 'Score: ' + score;
    isGameRunning = true;
    loop(); // Restart the draw loop

}

function foodlocation() { // placing food
    let x = floor(random(w));
    let y = floor(random(h));
    foodpos = createVector(x, y);
    foodImg = random(images); // Select a random image for the food

    if (score >=9 && score%3==0) {
        let gx = floor(random(w));
        let gy = floor(random(h));
        greenBlockPos = createVector(gx, gy);
    } else {
        greenBlockPos = null;
    }

}

function slowDownSnake() {
    if (!isSlowedDown) {
        isSlowedDown = true;
        frameRate(slowSpeed);
        snakeColor = "#FFF806";
        slowDownTimer = setTimeout(() => {
            isSlowedDown = false;
            frameRate(14); //going back to old speed
            snakeColor = "#FF0606"; //yellow
        }, 12000); // 12 seconds
    }
}


function keyPressed() {
    if (!isGameRunning) return;
    if (keyCode === LEFT_ARROW && snake.xdir !== 1) {
        snake.setDir(-1, 0);
    } else if (keyCode === RIGHT_ARROW && snake.xdir !== -1) {
        snake.setDir(1, 0);
    } else if (keyCode === DOWN_ARROW && snake.ydir !== -1) {
        snake.setDir(0, 1);
    } else if (keyCode === UP_ARROW && snake.ydir !== 1) {
        snake.setDir(0, -1);
    }
}

function draw() {
    if (!isGameRunning) {
        noLoop();
        return;
    }
    scale(rez);
    background("black"); //Bg color
    if (snake.eat(foodpos)) {
        foodlocation();
    }

    if (greenBlockPos && snake.eatGreenBlock(greenBlockPos)) {
        greenBlockPos = null;
        slowDownSnake();
    }

    snake.update();
    snake.show();

    if (snake.endGame()) {
        background("#C0C0C0"); //grey
        isGameRunning = false;
        noLoop();
    }

    noStroke();
    image(foodImg, foodpos.x, foodpos.y, 1, 1);

    if (greenBlockPos) {
        fill("green");
        rect(greenBlockPos.x, greenBlockPos.y, 1, 1);
    }

}

class Snake {
    constructor() {
        this.body = [];
        this.body[0] = createVector(floor(w / 2), floor(h / 2));
        this.xdir = 0;
        this.ydir = 0;
        this.len = 0;
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    update() {
        let head = this.body[this.body.length - 1].copy();
        this.body.shift();
        head.x += this.xdir;
        head.y += this.ydir;
        this.body.push(head);
    }

    eatGreenBlock(pos) {
        let x = this.body[this.body.length - 1].x;
        let y = this.body[this.body.length - 1].y;
        if (x === pos.x && y === pos.y) {
            return true;
        }
        return false;
    }
    
    grow() {
        let head = this.body[this.body.length - 1].copy();
        this.len++;
        this.body.push(head);
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        if (score >4 && score <=8 && !isSlowedDown){
            frameRate(10);
            snakeColor="#FF7B06"; //orange

        }
        if (score >8 && !isSlowedDown){
            frameRate(14);
            snakeColor="#FF0606"; //red
        }

    }

    endGame() {
        let x = this.body[this.body.length - 1].x;
        let y = this.body[this.body.length - 1].y;
        if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
            return true;
        }
        for (let i = 0; i < this.body.length - 1; i++) {
            let part = this.body[i];
            if (part.x === x && part.y === y) {
                return true;
            }
        }
        return false;
    }

    eat(pos) {
        let x = this.body[this.body.length - 1].x;
        let y = this.body[this.body.length - 1].y;
        if (x === pos.x && y === pos.y) {
            this.grow();
            return true;
        }
        return false;
    }

    show() {
        for (let i = 0; i < this.body.length; i++) {
            fill(snakeColor); //snake color
            noStroke();
            rect(this.body[i].x, this.body[i].y, 1, 1);
        }
    }
}
