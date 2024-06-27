const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pencilColor = document.querySelectorAll('.pencil-color');
const pencilWidthEle = document.querySelector('.pencil-width');
const eraserWidthEle = document.querySelector('.eraser-width');

let mouseDown = false;

let penColor = 'blue';
let eraserColor = 'white';
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;

// API:
const ctx = canvas.getContext('2d');
ctx.strokeStyle = penColor;
ctx.lineWidth = penWidth;

// mouse down -> start new path, mousemove -> path fill
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    beginPath({ x: e.clientX, y: e.clientY });
});

canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        drawLine({ x: e.clientX, y: e.clientY });
    }
});

canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
});

function beginPath(strokeObj) {
    ctx.beginPath();
    ctx.moveTo(strokeObj.x, strokeObj.y);
}

function drawLine(strokeObj) {
    ctx.lineTo(strokeObj.x, strokeObj.y);
    ctx.stroke();
}
pencilColor.forEach((color) => {
    color.addEventListener('click', () => {
        penColor = color.classList[0];
        ctx.strokeStyle = penColor;
    });
});

pencilWidthEle.addEventListener('change', () => {
    penWidth = pencilWidthEle.value;
    ctx.lineWidth = penWidth;
});

eraserWidthEle.addEventListener('change', () => {
    eraserWidth = eraserWidthEle.value;
    ctx.lineWidth = eraserWidth;
});

eraser.addEventListener('click', () => {
    if (eraserFlag) {
        ctx.strokeStyle = eraserColor;
        ctx.lineWidth = eraserWidth;
    } else {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
    }
});
