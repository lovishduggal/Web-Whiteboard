const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const download = document.querySelector('.download');
const pencilColor = document.querySelectorAll('.pencil-color');
const pencilWidthEle = document.querySelector('.pencil-width');
const eraserWidthEle = document.querySelector('.eraser-width');
const redo = document.querySelector('.redo');
const undo = document.querySelector('.undo');
const shapesCont = document.querySelector('.shapes-cont');

let mouseDown = false;

let penColor = 'blue';
let eraserColor = 'white';
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;

let undoRedoStack = [];
let undoRedoIndex = 0;

// API:
const ctx = canvas.getContext('2d', { willReadFrequently: true });
ctx.strokeStyle = penColor;
ctx.lineWidth = penWidth;

let startX,
    startY,
    snapshot,
    shapeMode = '';

// Add listeners to shapes
shapesCont.addEventListener('click', (e) => {
    // Do socket stuff
    // console.log(e.target.alt);
    shapeMode = e.target.alt;
});

// mouse down -> start new path, mousemove -> path fill
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    const data = { x: e.clientX, y: e.clientY };
    // Sends data to the server
    socket.emit('beginPath', data);
    // beginPath(data);
});

canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        const data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth,
        };

        socket.emit('drawLine', data);
        // drawLine(data);
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
    const data = {
        undoRedoIndex,
        undoRedoStack,
    };
    socket.emit('undoRedoCanvas', data);
});

redo.addEventListener('click', (e) => {
    if (undoRedoIndex < undoRedoStack.length - 1) {
        undoRedoIndex++;
    }
    const data = {
        undoRedoIndex,
        undoRedoStack,
    };
    socket.emit('undoRedoCanvas', data);
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
    if (shapeMode) {
        startX = strokeObj.x;
        startY = strokeObj.y;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
        ctx.moveTo(strokeObj.x, strokeObj.y);
    }
}

function drawRectangle(startX, startY, endX, endY) {
    return ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function drawCircle(startX, startY, endX, endY) {
    const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    return;
}

function drawTriangle(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(startX * 2 - endX, endY);
    ctx.closePath();
    ctx.stroke();
    return;
}

function drawHeart(startX, startY, endX, endY) {
    const size = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    ctx.beginPath();
    ctx.moveTo(startX, startY + size / 4);
    ctx.quadraticCurveTo(startX, startY, startX + size / 4, startY);
    ctx.quadraticCurveTo(
        startX + size / 2,
        startY,
        startX + size / 2,
        startY + size / 4
    );
    ctx.quadraticCurveTo(
        startX + size / 2,
        startY + size / 2,
        startX,
        startY + size
    );
    ctx.quadraticCurveTo(
        startX - size / 2,
        startY + size / 2,
        startX - size / 2,
        startY + size / 4
    );
    ctx.quadraticCurveTo(startX - size / 2, startY, startX - size / 4, startY);
    ctx.quadraticCurveTo(startX, startY, startX, startY + size / 4);
    ctx.closePath();
    ctx.stroke();
    return;
}

function drawLine(strokeObj) {
    toolbar.strokeStyle = strokeObj.color;
    toolbar.lineWidth = strokeObj.width;
    if (shapeMode) {
        ctx.putImageData(snapshot, 0, 0);
        const endX = strokeObj.x;
        const endY = strokeObj.y;
        if (shapeMode === 'rectangle') {
            return drawRectangle(startX, startY, endX, endY);
        } else if (shapeMode === 'circle') {
            return drawCircle(startX, startY, endX, endY);
        } else if (shapeMode === 'triangle') {
            return drawTriangle(startX, startY, endX, endY);
        } else if (shapeMode === 'heart') {
            return drawHeart(startX, startY, endX, endY);
        }
    } else {
        ctx.lineTo(strokeObj.x, strokeObj.y);
        ctx.stroke();
    }
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

pencil.addEventListener('click', () => {
    shapeMode = '';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
});
eraser.addEventListener('click', () => {
    shapeMode = '';
    ctx.strokeStyle = eraserColor;
    ctx.lineWidth = eraserWidth;
});

download.addEventListener('click', () => {
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    link.click();
});

socket.on('beginPath', (data) => {
    // Receives data from the server
    beginPath(data);
});

socket.on('drawLine', (data) => {
    // Receives data from the server
    drawLine(data);
});

socket.on('undoRedoCanvas', (data) => {
    // Receives data from the server
    undoRedoCanvas(data);
});