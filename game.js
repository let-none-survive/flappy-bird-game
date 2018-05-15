const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeBottom = new Image();

bird.src = "img/bird.png";
bg.src = "img/bg.png"; 
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

const fly = new Audio();
const score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

const gap = 80;

document.addEventListener('mousedown', moveUp);
document.addEventListener('keydown', moveUp);

function moveUp() {
    yPos -= 25;
    fly.play();
}

let pipes = [];

pipes[0] = {
    x: cvs.width,
    y: 0
}

let xPos = 10;
let yPos = 150;
const grav = 1.5;

let score = 0;
let bestScore = localStorage.getItem('best') || 0;

function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);
        
        pipes[i].x--;

        if(pipes[i].x == 125) {
            pipes.push({
                x : cvs.width,
                y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            });
        }
        if(xPos + bird.width >= pipes[i].x
            && xPos <= pipes[i].x + pipeUp.width
            && (yPos <= pipes[i].y + pipeUp.height
            || yPos + bird.height >= pipes[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
            location.reload();
        }
        if (pipes[i].x == 5) {
            score++;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('best', bestScore)
            }
            score_audio.play();
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    yPos += grav;

    ctx.fillStyle = '#000';
    ctx.font = '24px Verdana';
    ctx.fillText(`Score: ${score}`, 10, cvs.height - 20);
    ctx.fillText(`Best: ${bestScore}`, 190, cvs.height - 20);

    requestAnimationFrame(draw)
}

pipeBottom.onload = draw;