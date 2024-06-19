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
optionsCont.addEventListener('click', () => {
    optionsFlag = !optionsFlag;
    if (optionsFlag) openTools();
    else closeTools();
});

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
                                  <!-- <i class="fa-solid fa-up-right-and-down-left-from-center"></i> -->
                                </div>
                                <div class="remove"><i class="fa-solid fa-xmark"></i></div>
                                 </div>
                                <div class="note-cont">
                                  <textarea></textarea>
                                </div>`;

    document.body.appendChild(stickyCont);
});
