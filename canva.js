const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const download = document.querySelector('.download');
const pencilColor = document.querySelectorAll('.pencil-color');
const pencilWidthEle = document.querySelector('.pencil-width');
const eraserWidthEle = document.querySelector('.eraser-width');
const redo = document.querySelector('.redo');
const undo = document.querySelector('.undo');

let mouseDown = false;

let penColor = 'blue';
let eraserColor = 'white';
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;

let undoRedoStack = [];
let undoRedoIndex = 0;

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
        drawLine({
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth,
        });
    }
});

canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    const dataURL = canvas.toDataURL();
    undoRedoStack.push(dataURL);
    undoRedoIndex = undoRedoStack.length - 1;
});

undo.addEventListener('click', (e) => {
    if (undoRedoIndex > 0) {
        undoRedoIndex--;
    }
    const trackObj = {
        undoRedoIndex,
        undoRedoStack,
    };
    undoRedoCanvas(trackObj);
});

redo.addEventListener('click', (e) => {
    if (undoRedoIndex < undoRedoStack.length - 1) {
        undoRedoIndex++;
    }
    const trackObj = {
        undoRedoIndex,
        undoRedoStack,
    };
    undoRedoCanvas(trackObj);
});

function undoRedoCanvas(trackObj) {
    undoRedoIndex = trackObj.undoRedoIndex;
    undoRedoStack = trackObj.undoRedoStack;
    const dataURL = undoRedoStack[undoRedoIndex];
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}
function beginPath(strokeObj) {
    ctx.beginPath();
    ctx.moveTo(strokeObj.x, strokeObj.y);
}

function drawLine(strokeObj) {
    toolbar.strokeStyle = strokeObj.color;
    toolbar.lineWidth = strokeObj.width;
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
    ctx.strokeStyle = penColor;
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

download.addEventListener('click', () => {
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    link.click();
});
