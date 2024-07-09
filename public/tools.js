// Select DOM elements
const optionsCont = document.querySelector('.options-cont');
const toolsCont = document.querySelector('.tools-cont');
const pencilToolCont = document.querySelector('.pencil-tool-cont');
const eraserToolCont = document.querySelector('.eraser-tool-cont');
const shapesToolCont = document.querySelector('.shapes-tool-cont');
const shapesCont = document.querySelector('.shapes-cont');
const setting = document.querySelector('.setting');
const pencil = document.querySelector('.pencil');
const eraser = document.querySelector('.eraser');
const sticky = document.querySelector('.sticky-note');
const upload = document.querySelector('.upload');

// State variables
let optionsFlag = true;
let pencilFlag,
    eraserFlag,
    settingFlag,
    shapeMode = false;

/**
 * Toggles the options flag and opens or closes the tools accordingly.
 */
const toggleOptions = () => {
    optionsFlag = !optionsFlag;
    optionsFlag ? openTools() : closeTools();
};

/**
 * Opens the tools container by changing the icon and adjusting the display and transform styles.
 */
const openTools = () => {
    const iconElement = optionsCont.children[0];
    iconElement.classList.replace('fa-xmark', 'fa-bars');
    toolsCont.style.display = 'flex';
    toolsCont.style.transform = 'translateX(0rem)';
};

/**
 * Closes the tools container by changing the icon and adjusting the display and transform styles.
 */
const closeTools = () => {
    const iconElement = optionsCont.children[0];
    iconElement.classList.replace('fa-bars', 'fa-xmark');
    toolsCont.style.transform = 'translateX(-10rem)';
    pencilToolCont.style.display = 'none';
    eraserToolCont.style.display = 'none';
};

/**
 * Toggles the pencil tool flag and emits the state.
 */
const togglePencil = () => {
    pencilFlag = !pencilFlag;
    socket.emit('pencil', { pencilFlag });
};

/**
 * Toggles the eraser tool flag and emits the state.
 */
const toggleEraser = () => {
    eraserFlag = !eraserFlag;
    socket.emit('eraser', { eraserFlag });
};

/**
 * Emits the selected shape mode.
 * @param {Event} e - The click event.
 */
const selectShapeMode = (e) => {
    const data = e.target.alt;
    if (data !== 'setting') socket.emit('shapeMode', data);
};

/**
 * Toggles the setting flag and emits the state along with the shape mode.
 */
const toggleSetting = () => {
    shapeMode = shapeMode || 'rectangle';
    settingFlag = !settingFlag;
    socket.emit('setting', { settingFlag, shapeMode });
};

/**
 * Creates a sticky note with the provided HTML template.
 * @param {string} htmlTemplate - The HTML template for the sticky note.
 */
const createStickyNote = (htmlTemplate) => {
    const stickyCont = document.createElement('div');
    stickyCont.className = 'sticky-cont';
    stickyCont.innerHTML = htmlTemplate;

    document.body.appendChild(stickyCont);

    const minimize = stickyCont.querySelector('.minimize');
    const remove = stickyCont.querySelector('.remove');
    addStickyNoteActions(stickyCont, minimize, remove);

    stickyCont.onmousedown = (e) => dragAndDrop(stickyCont, e);
    stickyCont.ondragstart = () => false;
};

/**
 * Adds actions to the sticky note for minimizing and removing.
 * @param {HTMLElement} element - The sticky note element.
 * @param {HTMLElement} minimize - The minimize button element.
 * @param {HTMLElement} remove - The remove button element.
 */
const addStickyNoteActions = (element, minimize, remove) => {
    remove.addEventListener('click', () => element.remove());

    minimize.addEventListener('click', () => {
        const noteCont = element.querySelector('.note-cont');
        const display = getComputedStyle(noteCont).display;
        noteCont.style.display = display === 'none' ? 'block' : 'none';
        minimize.children[0].classList.toggle(
            'fa-up-right-and-down-left-from-center'
        );
        minimize.children[0].classList.toggle(
            'fa-down-left-and-up-right-to-center'
        );
    });
};

/**
 * Enables drag and drop functionality for the sticky note.
 * @param {HTMLElement} element - The sticky note element.
 * @param {MouseEvent} event - The mousedown event.
 */
const dragAndDrop = (element, event) => {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    const moveAt = (pageX, pageY) => {
        element.style.left = `${pageX - shiftX}px`;
        element.style.top = `${pageY - shiftY}px`;
    };

    const onMouseMove = (event) => {
        moveAt(event.pageX, event.pageY);
    };

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
};

/**
 * Handles file upload and creates a sticky note with the uploaded image.
 */
const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        const htmlTemplate = `
            <div class="header-cont">
                <div class="minimize">
                    <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
                </div>
                <div class="remove"><i class="fa-solid fa-xmark"></i></div>
            </div>
            <div class="note-cont">
                <img src="${url}" alt="image" />
            </div>`;
        createStickyNote(htmlTemplate);
    });
};

/**
 * Creates a sticky note with a textarea.
 */
const createTextStickyNote = () => {
    const htmlTemplate = `
        <div class="header-cont">
            <div class="minimize">
                <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
            </div>
            <div class="remove"><i class="fa-solid fa-xmark"></i></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>`;
    createStickyNote(htmlTemplate);
};

// Event listeners
optionsCont.addEventListener('click', toggleOptions);
pencil.addEventListener('click', togglePencil);
eraser.addEventListener('click', toggleEraser);
shapesCont.addEventListener('click', selectShapeMode);
setting.addEventListener('click', toggleSetting);
upload.addEventListener('click', handleFileUpload);
sticky.addEventListener('click', createTextStickyNote);
