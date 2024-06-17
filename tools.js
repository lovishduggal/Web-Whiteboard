const optionsCont = document.querySelector('.options-cont');
const toolsCont = document.querySelector('.tools-cont');
const pencilToolCont = document.querySelector('.pencil-tool-cont');
const eraserToolCont = document.querySelector('.eraser-tool-cont');
let optionsOpen = true;
optionsCont.addEventListener('click', () => {
    optionsOpen = !optionsOpen;
    if (optionsOpen) openTools();
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
    toolsCont.style.display = 'none';
    pencilToolCont.style.display = 'none';
    eraserToolCont.style.display = 'none';
}
