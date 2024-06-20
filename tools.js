const optionsCont = document.querySelector('.options-cont');
let optionsFlag = true;
const toolsCont = document.querySelector('.tools-cont');
const pencilToolCont = document.querySelector('.pencil-tool-cont');
const eraserToolCont = document.querySelector('.eraser-tool-cont');
const pencil = document.querySelector('.pencil');
const eraser = document.querySelector('.eraser');
const sticky = document.querySelector('.sticky-note');
let pencilFlag = false;
let eraserFlag = false;
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
    if (pencilFlag) pencilToolCont.style.display = 'block';
    else pencilToolCont.style.display = 'none';
});

eraser.addEventListener('click', () => {
    eraserFlag = !eraserFlag;
    if (eraserFlag) eraserToolCont.style.display = 'flex';
    else eraserToolCont.style.display = 'none';
});

sticky.addEventListener('click', (e) => {
    const stickyCont = document.createElement('div');
    stickyCont.setAttribute('class', 'sticky-cont');
    stickyCont.innerHTML = `  <div class="header-cont">
                                <div class="minimize">
                                  <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
                                </div>
                                <div class="remove"><i class="fa-solid fa-xmark"></i></div>
                                 </div>
                                <div class="note-cont">
                                  <textarea></textarea>
                                </div>`;

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
