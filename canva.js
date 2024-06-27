const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseDown = false;

// API:
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'blue';
ctx.lineWidth = 3;

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
