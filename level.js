const experiencePanel = CreateGUIPanel(3, 1);
const experienceText = AddButton(experiencePanel, "", () => {} );
const levelTopMenuItem = AddTopMenuItem("", null, experiencePanel);

function GetExpToLevel(lvl)
{
    return 1561 + 316*lvl + 79*lvl*lvl;
}

var level = 1;
var exp = 0;
var nextExp = GetExpToLevel(level);

elementsCombined = () => {
    exp++;
    if(exp >= nextExp)
    {
        level++;
        exp = 0;
        nextExp = GetExpToLevel(level);
    }
};

function UpdateExperienceInfo()
{
    experienceText.innerHTML = (exp + "/" + nextExp);
    levelTopMenuItem.innerHTML = "Lv." + level;
    requestAnimationFrame(UpdateExperienceInfo);
}

requestAnimationFrame(UpdateExperienceInfo);