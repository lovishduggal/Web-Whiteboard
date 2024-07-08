const optionsCont = document.querySelector('.options-cont');
let optionsFlag = true;
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
let pencilFlag = false;
let eraserFlag = false;
let settingFlag = false;
let shapeMode = '';

/**
 * Toggles the options flag and opens or closes the tools accordingly.
 * Adds an event listener to the options container that listens for click events.
 */
optionsCont.addEventListener('click', () => {
    optionsFlag = !optionsFlag;
    if (optionsFlag) openTools();
    else closeTools();
});

/**
 * Opens the tools container by changing the icon and adjusting the display and transform styles.
 */
function openTools() {
    const iconElement = optionsCont.children[0];
    iconElement.classList.remove('fa-xmark');
    iconElement.classList.add('fa-bars');
    toolsCont.style.display = 'flex';
    toolsCont.style.transform = 'translateX(0rem)';
}

function closeTools() {
    const iconElement = optionsCont.children[0];
    iconElement.classList.remove('fa-bars');
    iconElement.classList.add('fa-xmark');
    toolsCont.style.transform = 'translateX(-10rem)';
    pencilToolCont.style.display = 'none';
    eraserToolCont.style.display = 'none';
}

pencil.addEventListener('click', () => {
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        console.log('inside pencil');
        pencilToolCont.style.display = 'block';
        eraserToolCont.style.display = 'none';
        shapesToolCont.style.display = 'none';
        shapeMode = '';
    } else {
        pencilToolCont.style.display = 'none';
    }
});

eraser.addEventListener('click', () => {
    const data = {
        eraserFlag: !eraserFlag,
    };
    socket.emit('eraser', data);
    // eraserFlag = !eraserFlag;
    // if (eraserFlag) eraserToolCont.style.display = 'flex';
    // else eraserToolCont.style.display = 'none';
});

shapesCont.addEventListener('click', (e) => {
    // Do socket stuff
    // console.log(e.target.alt);
    const data = e.target.alt;
    console.log(data);
    if (!(data === 'setting')) socket.emit('shapeMode', data);
});

setting.addEventListener('click', (e) => {
    shapeMode = shapeMode ? shapeMode : 'rectangle';
    const data = {
        settingFlag: !settingFlag,
    };
    socket.emit('setting', data);
});

function createStickyNote(htmlTemplate) {
    const stickyCont = document.createElement('div');
    stickyCont.setAttribute('class', 'sticky-cont');
    stickyCont.innerHTML = htmlTemplate;

    document.body.appendChild(stickyCont);

    const minimize = stickyCont.querySelector('.minimize');
    const remove = stickyCont.querySelector('.remove');
    stickyNoteActions(stickyCont, minimize, remove);

    stickyCont.onmousedown = function (e) {
        dragAndDrop(stickyCont, e);
    };
    stickyCont.ondragstart = function () {
        return false;
    };
}

upload.addEventListener('click', () => {
    // Open file explorer and get the file path
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.click();
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        const htmlTemplate = `<div class="header-cont">
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
});

sticky.addEventListener('click', (e) => {
    const htmlTemplate = `<div class="header-cont">
    <div class="minimize">
      <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
    </div>
    <div class="remove"><i class="fa-solid fa-xmark"></i></div>
     </div>
    <div class="note-cont">
      <textarea spellcheck="false"></textarea>
    </div>`;
    createStickyNote(htmlTemplate);
});

// Sticky note actions
function stickyNoteActions(element, minimize, remove) {
    remove.addEventListener('click', () => {
        element.remove();
    });

    minimize.addEventListener('click', () => {
        const noteCont = element.querySelector('.note-cont');
        const display = getComputedStyle(noteCont).getPropertyValue('display');
        console.log(minimize, minimize.children);
        if (display === 'none') {
            noteCont.style.display = 'block';
            minimize.children[0].classList.remove(
                'fa-up-right-and-down-left-from-center'
            );
            minimize.children[0].classList.add(
                'fa-down-left-and-up-right-to-center'
            );
        } else {
            noteCont.style.display = 'none';
            minimize.children[0].classList.remove(
                'fa-down-left-and-up-right-to-center'
            );
            minimize.children[0].classList.add(
                'fa-up-right-and-down-left-from-center'
            );
        }
    });
}
// Drag and Drop on sticky note
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    // document.body.append(element);

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
