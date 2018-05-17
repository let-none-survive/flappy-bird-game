const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let gameOver = false;

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

fg.style.zIndex = '999 !important';
pipeBottom.style.zIndex = -1;

const fly = new Audio();
const score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

const gap = 80;

document.addEventListener('keydown', moveUp);

function moveUp() {
    if (!gameOver) {
        yPos -= 25;
        fly.play();
    }
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

function exportCanvasAsPNG(id, fileName) {

    var canvasElement = document.getElementById(id);

    var MIME_TYPE = "image/png";

    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = fileName;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

function game_over(img) {
    swal(`Game over! Your score: ${score}. Best score: ${bestScore}.\nWanna share or download your result?`, {
        buttons: ["Nope", "Yep!"],
    }).then(e => {
        if (e) {
            swal({
                title: "Download?",
                text: "Do you wanna download this screenshot ?",
                icon: img,
                buttons: true,
                dangerMode: true,
            }).then(e => {
                if (e) {
                    exportCanvasAsPNG('canvas', 'flappyjsbirdResult', true)
                }
            }).then(e => {
                if (e) {
                    swal(`Your screenshot has been downloaded succesfull. Do you wish to continue game ?`, {
                        buttons: ["Nope", "Yep!"],
                    }).then(e => {
                        if (e) {
                            location.reload();
                        }
                    })
                } else {
                    swal(`Do you wish to continue game ?`, {
                        buttons: ["Nope", "Yep!"],
                    }).then(e => {
                        if (e) {
                            location.reload();
                        }
                    })
                }
            })
        } else {
            swal(`Do you wish to continue game ?`, {
                buttons: ["Nope", "Yep!"],
            }).then(e => {
                if (e) {
                    location.reload();
                }
            })
        }
    })
    return false
}

function draw() {
    ctx.drawImage(bg, 0, 0);

    ctx.drawImage(bird, xPos, yPos);

    yPos += grav;


    for (let i = 0; i < pipes.length; i++) {

        ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);
        ctx.drawImage(fg, 0, cvs.height - fg.height);

        ctx.fillStyle = '#000';
        ctx.font = '24px Verdana';
        ctx.fillText(`Score: ${score}`, 10, cvs.height - 20);
        ctx.fillText(`Best: ${bestScore}`, 190, cvs.height - 20);

        pipes[i].x--;


        if (pipes[i].x == 125) {
            pipes.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            });
        }

        if (xPos + bird.width >= pipes[i].x &&
            xPos <= pipes[i].x + pipeUp.width &&
            (yPos <= pipes[i].y + pipeUp.height ||
                yPos + bird.height >= pipes[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
            gameOver = true;
        }

        if (pipes[i].x == 5) {
            score++;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('best', bestScore)
            }
            score_audio.play();
        }
        if (gameOver) {
            let image = cvs.toDataURL("image/png");
            game_over(image);
        }
    }

    if (gameOver) return false;
    requestAnimationFrame(draw)
}

pipeBottom.onload = draw;