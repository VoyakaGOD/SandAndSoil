const experiencePanel = CreateGUIPanel(3, 1);
const experienceText = AddButton(experiencePanel, "", () => {} );
const levelTopMenuItem = AddTopMenuItem("", null, experiencePanel);

function GetExpToLevel(lvl)
{
    return 1561 + 316*lvl + 79*lvl*lvl;
}

var level = parseInt(localStorage.getItem("SandAndSoil_level")) || 1;
var exp = 0;
var nextExp = GetExpToLevel(level);

elementsCombined = () => {
    exp++;
    if(exp >= nextExp)
    {
        level++;
        exp = 0;
        nextExp = GetExpToLevel(level);
        for(let i = 0; i < elements.length; i++)
        {
            if(!elements[i].locked && elements[i].unlockAtLevel == level)
            {
                elementButtons[i].innerHTML = elements[i].name;
                elementButtons[i].onclick = (ge, me) => brushId = i;
            }
        }
        localStorage.setItem("SandAndSoil_level", level.toString());
    }
};

function UpdateExperienceInfo()
{
    experienceText.innerHTML = (exp + "/" + nextExp);
    levelTopMenuItem.innerHTML = "Lv." + level;
    requestAnimationFrame(UpdateExperienceInfo);
}

requestAnimationFrame(UpdateExperienceInfo);