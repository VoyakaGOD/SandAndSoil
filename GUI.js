const brushSizeInput = document.createElement("input");
brushSizeInput.type = 'range';
brushSizeInput.min = 1;
brushSizeInput.max = 9;
brushSizeInput.value = brushSize;
brushSizeInput.step = 1;
document.body.appendChild(brushSizeInput);
brushSizeInput.addEventListener('change', (event) => {
    brushSize = brushSizeInput.value;
});

const pauseButton = document.createElement("button");
pauseButton.innerHTML = "pause";
pauseButton.onclick = (fe, me) => pause = !pause;
document.body.appendChild(pauseButton);

function CreateElementButtons()
{
    for(let i = 0; i < elements.length; i++)
    {
        let elementButton = document.createElement("button");
        elementButton.innerHTML = elements[i].name;
        elementButton.onclick = (fe, me) => brushId = i;
        document.body.appendChild(elementButton);
    }
}