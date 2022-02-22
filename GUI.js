const TOP_MENU_HEIGHT = 35;
const GUI_ITEM_HEIGHT = 35;
const TOP_MENU_ITEM_WIDTH = 175;

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
    return item;
}

function CreateGUIPanel(order, itemCount)
{
    let panel = document.createElement("div");
    panel.className = "GUIPanel";
    panel.style.left = order*TOP_MENU_ITEM_WIDTH+"px";
    panel.style.top = TOP_MENU_HEIGHT+"px";
    panel.style.height = itemCount*GUI_ITEM_HEIGHT+"px";
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

function ChangePanelHeight(panel, newItemCount)
{
    panel.style.height = newItemCount*GUI_ITEM_HEIGHT+"px";
}

function ToOnOff(boolValue)
{
    if(boolValue)
        return "(on)";
    return "(off)";
}

/////////////////////////////////////////////////////////////////////

const elementsPanel = CreateGUIPanel(0, 0);
const brushPanel = CreateGUIPanel(1, 2);

AddTopMenuItem("elements", null, elementsPanel);
AddTopMenuItem("brush", null, brushPanel);
AddTopMenuItem("pause", (self) =>{
    pause = !pause;
    if(pause)
        self.innerHTML = "resume";
    else
        self.innerHTML = "pause";
}, null);

const replacementButton = AddButton(brushPanel, "replacement" + ToOnOff(replacement), (ge, me) => {
    replacement = !replacement;
    replacementButton.innerHTML = "replacement" + ToOnOff(replacement);
});
const brushSizeSlider = AddSlider(brushPanel, 1, 9, brushSize, 1, (event) => brushSize = brushSizeSlider.value);

const elementButtons = [];

function CreateElementButtons()
{
    let elementCount = 0;
    for(let i = 0; i < elements.length; i++)
    {
        if(elements[i].locked)
        {
            elementButtons.push(null);
        }
        else
        {
            if(!elements[i].unlockAtLevel)
                elementButtons.push(AddButton(elementsPanel, elements[i].name, (ge, me) => brushId = i));
            else
                elementButtons.push(AddButton(elementsPanel, "locked(" + elements[i].unlockAtLevel + ")", (ge, me) => {}));
            elementCount++;
        }
    }
    ChangePanelHeight(elementsPanel, elementCount);
}