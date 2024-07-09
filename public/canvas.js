// JavaScript

// Utility functions
const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);
const setCanvasSize = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

// Initialize canvas and context
const canvas = getElement('canvas');
setCanvasSize(canvas);
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Initialize DOM elements
const download = getElement('.download');
const pencilColor = getElements('.pencil-color');
const shapesColor = getElements('.shapes-color');
const pencilWidthEle = getElement('.pencil-width');
const eraserWidthEle = getElement('.eraser-width');
const shapesWidthEle = getElement('.shapes-width');
const redo = getElement('.redo');
const undo = getElement('.undo');

// Initialize state variables
let mouseDown = false;
let penColor = 'blue';
let eraserColor = 'white';
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;
let undoRedoStack = [];
let undoRedoIndex = 0;
let startX,
    startY,
    snapshot = '';

// Set initial context properties
ctx.strokeStyle = penColor;
ctx.lineWidth = penWidth;

// Event handler functions
/**
 * Handles the mouse down event.
 *
 * @param {MouseEvent} e - The mouse event object.
 */
const handleMouseDown = (e) => {
    mouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = { x: e.clientX, y: e.clientY };
    socket.emit('beginPath', data);
};

/**
 * Handles the mouse move event and emits drawing data to the server if the mouse is pressed down.
 *
 * @param {MouseEvent} e - The mouse event object.
 */

/**
 * Handles the mouse move event and emits drawing data to the server if the mouse is pressed down.
 *
 * @param {MouseEvent} e - The mouse event object.
 */
const handleMouseMove = (e) => {
    if (mouseDown) {
        const data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth,
        };
        socket.emit('drawLine', data);
    }
};

/**
 * Handles the mouse up event.
 * Sets the mouseDown flag to false, captures the current state of the canvas as a data URL,
 * and pushes it onto the undo/redo stack. Updates the undo/redo index to the latest entry.
 */
const handleMouseUp = () => {
    mouseDown = false;
    const dataURL = canvas.toDataURL();
    undoRedoStack.push(dataURL);
    undoRedoIndex = undoRedoStack.length - 1;
};

/**
 * Handles the undo action by decrementing the undoRedoIndex if possible
 * and emitting the updated undoRedoIndex and undoRedoStack to the server.
 */
const handleUndo = () => {
    if (undoRedoIndex > 0) undoRedoIndex--;
    const data = { undoRedoIndex, undoRedoStack };
    socket.emit('undoRedoCanvas', data);
};

/**
 * Handles the redo action by incrementing the undoRedoIndex if possible
 * and emitting the updated undoRedoIndex and undoRedoStack to the server.
 */
const handleRedo = () => {
    if (undoRedoIndex < undoRedoStack.length - 1) undoRedoIndex++;
    const data = { undoRedoIndex, undoRedoStack };
    socket.emit('undoRedoCanvas', data);
};

/**
 * Handles the download of the canvas content as an image file.
 * Converts the canvas content to a data URL, creates a temporary link element,
 * sets the download attribute with a filename, sets the href to the data URL,
 * and programmatically clicks the link to trigger the download.
 */
const handleDownload = () => {
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    link.click();
};

/**
 * Handles the change of the pencil color.
 * This function updates the pen color based on the class of the event target
 * and sets the stroke style of the canvas context to the new pen color.
 *
 * @param {Event} e - The event object from the color change event.
 */
const handlePencilColorChange = (e) => {
    penColor = e.target.classList[0];
    ctx.strokeStyle = penColor;
};

/**
 * Handles the change in shape color by updating the canvas context's stroke style
 * based on the class of the event target.
 *
 * @param {Event} e - The event object containing information about the event.
 */
const handleShapesColorChange = (e) => {
    penColor = e.target.classList[0];
    ctx.strokeStyle = penColor;
};

/**
 * Handles the change in pencil width by updating the pen width and
 * applying the new width and current pen color to the drawing context.
 */
const handlePencilWidthChange = () => {
    penWidth = pencilWidthEle.value;
    ctx.lineWidth = penWidth;
    ctx.strokeStyle = penColor;
};

/**
 * Handles the change in eraser width by updating the canvas context's line width
 * and stroke style based on the current value of the eraser width element.
 */
const handleEraserWidthChange = () => {
    eraserWidth = eraserWidthEle.value;
    ctx.lineWidth = eraserWidth;
    ctx.strokeStyle = eraserColor;
};

/**
 * Handles the change in shape width by updating the canvas context's line width
 * based on the current value of the shapes width element.
 */
const handleShapesWidthChange = () => {
    penWidth = shapesWidthEle.value;
    ctx.lineWidth = penWidth;
    ctx.strokeStyle = penColor;
};

// Drawing functions
/**
 * Draws a rectangle on the canvas.
 *
 * @param {number} startX - The x-coordinate of the starting point of the rectangle.
 * @param {number} startY - The y-coordinate of the starting point of the rectangle.
 * @param {number} endX - The x-coordinate of the ending point of the rectangle.
 * @param {number} endY - The y-coordinate of the ending point of the rectangle.
 */
const drawRectangle = (startX, startY, endX, endY) =>
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);

/**
 * Draws a circle on the canvas given a starting point and an ending point.
 * The radius of the circle is determined by the distance between the start and end points.
 *
 * @param {number} startX - The x-coordinate of the starting point.
 * @param {number} startY - The y-coordinate of the starting point.
 * @param {number} endX - The x-coordinate of the ending point.
 * @param {number} endY - The y-coordinate of the ending point.
 */
const drawCircle = (startX, startY, endX, endY) => {
    const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

/**
 * Draws a triangle on the canvas.
 *
 * @param {number} startX - The x-coordinate of the starting point.
 * @param {number} startY - The y-coordinate of the starting point.
 * @param {number} endX - The x-coordinate of the ending point.
 * @param {number} endY - The y-coordinate of the ending point.
 */
const drawTriangle = (startX, startY, endX, endY) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(startX * 2 - endX, endY);
    ctx.closePath();
    ctx.stroke();
};

/**
 * Draws a heart shape on the canvas.
 *
 * @param {number} startX - The x-coordinate of the starting point.
 * @param {number} startY - The y-coordinate of the starting point.
 * @param {number} endX - The x-coordinate of the ending point.
 * @param {number} endY - The y-coordinate of the ending point.
 */
const drawHeart = (startX, startY, endX, endY) => {
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
};

/**
 * Begins a new path or shape on the canvas context.
 *
 * @param {Object} strokeObj - The object containing the starting coordinates.
 * @param {number} strokeObj.x - The x-coordinate to begin the path.
 * @param {number} strokeObj.y - The y-coordinate to begin the path.
 */
const beginPath = (strokeObj) => {
    ctx.beginPath();
    if (shapeMode) {
        startX = strokeObj.x;
        startY = strokeObj.y;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
        ctx.moveTo(strokeObj.x, strokeObj.y);
    }
};

/**
 * Draws a line or shape on the canvas based on the provided stroke object.
 *
 * @param {Object} strokeObj - The object containing stroke properties.
 * @param {string} strokeObj.color - The color of the stroke.
 * @param {number} strokeObj.width - The width of the stroke.
 * @param {number} strokeObj.x - The x-coordinate of the stroke end point.
 * @param {number} strokeObj.y - The y-coordinate of the stroke end point.
 */
const drawLine = (strokeObj) => {
    ctx.strokeStyle = strokeObj.color;
    ctx.lineWidth = strokeObj.width;
    if (shapeMode) {
        ctx.putImageData(snapshot, 0, 0);
        const { x: endX, y: endY } = strokeObj;
        const shapeDrawers = {
            rectangle: drawRectangle,
            circle: drawCircle,
            triangle: drawTriangle,
            heart: drawHeart,
        };
        shapeDrawers[shapeMode](startX, startY, endX, endY);
    } else {
        ctx.lineTo(strokeObj.x, strokeObj.y);
        ctx.stroke();
    }
};

/**
 * Handles the undo and redo functionality for a canvas by updating the canvas
 * with the image data from the undo/redo stack at the specified index.
 *
 * @param {Object} trackObj - The object containing the undo/redo stack and index.
 * @param {number} trackObj.undoRedoIndex - The current index in the undo/redo stack.
 * @param {string[]} trackObj.undoRedoStack - The stack containing image data URLs for undo/redo operations.
 */
const undoRedoCanvas = (trackObj) => {
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
};

/**
 * Handles the mode switching logic for drawing tools.
 *
 * @param {Object} data - The data object containing mode-related properties.
 * @param {string} mode - The mode to switch to ('pencil', 'eraser', 'setting').
 */
const handleMode = (data, mode) => {
    shapeMode = mode === 'setting' ? data.shapeMode : '';

    const flagVal = data[`${mode}Flag`];
    const widthEle =
        mode === 'pencil'
            ? pencilWidthEle
            : mode === 'eraser'
            ? eraserWidthEle
            : shapesWidthEle;
    const toolCont =
        mode === 'pencil'
            ? pencilToolCont
            : mode === 'eraser'
            ? eraserToolCont
            : shapesToolCont;

    if (flagVal) {
        if (mode !== 'setting') {
            penWidth = widthEle.value;
            penColor = 'blue';
        } else {
            penWidth = widthEle.value;
        }

        toolCont.style.display = mode === 'eraser' ? 'flex' : 'block';
        pencilToolCont.style.display = mode === 'pencil' ? 'block' : 'none';
        eraserToolCont.style.display = mode === 'eraser' ? 'flex' : 'none';
        shapesToolCont.style.display = mode === 'setting' ? 'block' : 'none';

        pencilFlag = mode === 'pencil';
        eraserFlag = mode === 'eraser';
        settingFlag = mode === 'setting';
    } else {
        toolCont.style.display = 'none';
        if (mode === 'setting') shapeMode = '';
    }
};

/**
 * Handles the pencil mode by calling the handleMode function with the provided data.
 *
 * @param {Object} data - The data to be processed in pencil mode.
 */
const handlePencilMode = (data) => handleMode(data, 'pencil');

/**
 * Sets the mode to 'eraser' by calling the handleMode function with the provided data.
 *
 * @param {Object} data - The data to be passed to the handleMode function.
 */
const handleEraserMode = (data) => handleMode(data, 'eraser');

/**
 * Activates the setting mode by calling the handleMode function with the provided data.
 *
 * @param {Object} data - The data to be processed in eraser mode.
 */
const handleSettingMode = (data) => handleMode(data, 'setting');

/**
 * Adds event listeners to various elements on the canvas and toolbar.
 * This function sets up the necessary event handlers for user interactions
 * such as drawing, undoing, redoing, downloading, and changing tool settings.
 */
const addEventListeners = () => {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    undo.addEventListener('click', handleUndo);
    redo.addEventListener('click', handleRedo);
    download.addEventListener('click', handleDownload);
    pencilColor.forEach((color) =>
        color.addEventListener('click', handlePencilColorChange)
    );
    shapesColor.forEach((color) =>
        color.addEventListener('click', handleShapesColorChange)
    );
    pencilWidthEle.addEventListener('change', handlePencilWidthChange);
    eraserWidthEle.addEventListener('change', handleEraserWidthChange);
    shapesWidthEle.addEventListener('change', handleShapesWidthChange);
};

/**
 * Registers event handlers for various socket events.
 */
const socketEventHandlers = () => {
    /**
     * Event handler for 'beginPath' event.
     * @param {Object} data - Data associated with the beginPath event.
     */
    socket.on('beginPath', beginPath);

    /**
     * Event handler for 'drawLine' event.
     * @param {Object} data - Data associated with the drawLine event.
     */
    socket.on('drawLine', drawLine);

    /**
     * Event handler for 'undoRedoCanvas' event.
     * @param {Object} data - Data associated with the undoRedoCanvas event.
     */
    socket.on('undoRedoCanvas', undoRedoCanvas);

    /**
     * Event handler for 'shapeMode' event.
     * @param {Object} data - Data associated with the shapeMode event.
     */
    socket.on('shapeMode', (data) => {
        shapeMode = data;
    });

    /**
     * Event handler for 'pencil' event.
     * @param {Object} data - Data associated with the pencil event.
     */
    socket.on('pencil', handlePencilMode);

    /**
     * Event handler for 'eraser' event.
     * @param {Object} data - Data associated with the eraser event.
     */
    socket.on('eraser', handleEraserMode);

    /**
     * Event handler for 'setting' event.
     * @param {Object} data - Data associated with the setting event.
     */
    socket.on('setting', handleSettingMode);
};

/**
 * Initializes the application by setting up event listeners and socket event handlers.
 */
const init = () => {
    addEventListeners();
    socketEventHandlers();
};

init();
