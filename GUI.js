const topMenu = document.createElement("div");
topMenu.className = "topMenu";
document.body.appendChild(topMenu);

var selectedMenuItem = -1;
var dropdowns = [];

function AddTopMenuItem(text, onclick, dropdown)
{
    let index = dropdowns.length;
    let item = document.createElement("div");
    item.className = "topMenuItem";
    item.innerHTML = text;
    if(!onclick)
        onclick = (self) => {};
    item.onclick = (ge, me) => {
        onclick(item);

        if(!dropdown) return;

        if(selectedMenuItem == index)
        {
            selectedMenuItem = -1;
            dropdown.style.display = "none";
        }
        else
        {
            if(selectedMenuItem != -1)
                dropdowns[selectedMenuItem].style.display = "none";
            selectedMenuItem = index;
            dropdown.style.display = "inline-block";
        }
    }
    dropdowns.push(dropdown);
    topMenu.appendChild(item);
}

function CreateGUIPanel(order, itemsCount)
{
    let panel = document.createElement("div");
    panel.className = "GUIPanel";
    panel.style.left = order*150+"px";
    panel.style.top = "35px";
    panel.style.height = itemsCount*35+"px";
    document.body.appendChild(panel);
    panel.style.display = "none";
    return panel;
}

function AddButton(panel, text, onclick)
{
    let button = document.createElement("div");
    button.className = "GUIButton";
    button.innerHTML = text;
    button.onclick = onclick;
    panel.appendChild(button);
    return button;
}

function AddSlider(panel, min, max, val, step, onchange)
{
    let slider = document.createElement("input");
    slider.className = "GUISlider";
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = val;
    slider.step = step;
    panel.appendChild(slider);
    slider.addEventListener('change', onchange);
    return slider;
}

/////////////////////////////////////////////////////////////////////

const elementInputPanel = CreateGUIPanel(0, 3);
const brushInputPanel = CreateGUIPanel(1,2);

AddTopMenuItem("element", null, elementInputPanel);
AddTopMenuItem("brush", null, brushInputPanel);
AddTopMenuItem("pause", (self) =>{
    pause = !pause;
    if(pause)
        self.innerHTML = "resume";
    else
        self.innerHTML = "pause";
}, null);

let test = AddButton(brushInputPanel, "1777", (ge, me) => test.innerHTML = "7111");
AddSlider(brushInputPanel, 1, 9, brushSize, 1, (event) => brushSize = brushSizeInput.value);

function CreateElementButtons()
{
    for(let i = 0; i < elements.length; i++)
        AddButton(elementInputPanel, elements[i].name, (ge, me) => brushId = i);
}