const ElementIDs = {};

function MixColors(first, second)
{
    let rnd = Math.random();
    return rgb(first.r*rnd + second.r*(1-rnd),first.g*rnd + second.g*(1-rnd),first.b*rnd + second.b*(1-rnd));
}

function Unite(...funcs)
{
    return (self, x, y) => {
        for(let func of funcs)
            func(self, x, y);
    }
}

function Check(...reactions)
{
    return (self, x, y) => {
        let up = GetElement(x, y-1);
        let down = GetElement(x, y+1);
        let left = GetElement(x-1, y);
        let right = GetElement(x+1, y);
        for(let reaction of reactions)
        {
            reaction(self, x, y, up, x, y-1);
            reaction(self, x, y, down, x, y+1);
            reaction(self, x, y, left, x-1, y);
            reaction(self, x, y, right, x+1, y);
        }
    }
}

/////////////////////////////////////////////////////////////////////

function DoNothing(self, x, y) {}

function JustRepaint(self, x, y)
{
    Repaint(x,y,self.color);
}

function CanFall(tmass, smass)
{
    return Math.random() < (1-tmass/smass);
}

function Fall(self, x, y)
{
    if(CanFall(GetElement(x,y+1).src.mass, self.src.mass)) Swap(x,y,x,y+1);
    else if(CanFall(GetElement(x+1,y+1).src.mass, self.src.mass) && GetElement(x+1,y).src.mass < self.src.mass) Swap(x,y,x+1,y+1);
    else if(CanFall(GetElement(x-1,y+1).src.mass, self.src.mass) && GetElement(x-1,y).src.mass < self.src.mass) Swap(x,y,x-1,y+1);
}

function SimulateLiquid(self, x, y)
{
    let np = {x, y};
    if(Math.random() > 0.5)
    {
        if(CanFall(GetElement(x+1,y).src.mass, self.src.mass)) np = {x:x+1, y:y};
    }
    else
    {
        if(CanFall(GetElement(x-1,y).src.mass, self.src.mass)) np = {x:x-1, y:y};
    }
    if(CanFall(GetElement(x,y+1).src.mass, self.src.mass)) np = {x:x, y:y+1};
    Swap(x, y, np.x, np.y);
}

function FlyUp(self, x, y)
{
    if(Math.random() < 0.5) return;
    let dx = 1 - Math.floor(Math.random() * 3);
    if(GetElement(x+dx,y-1).id == ElementIDs.void)
        Swap(x,y,x+dx,y-1);
    else if(GetElement(x+dx,y-1).id == ElementIDs.border)
        Change(x, y, 1);
}

function BeFire(self, x, y)
{
    if(Math.random() < 0.5) return;
    let dx = 1 - Math.floor(Math.random() * 3);
    if(GetElement(x+dx,y-1).id == ElementIDs.sand) CombineElements(x+dx,y-1,x,y,ElementIDs.glass);
    else if(GetElement(x+dx,y-1).id == ElementIDs.water) CombineElements(x+dx,y-1,x,y,ElementIDs.steam);
    else FlyUp(self, x, y);
    self.val -= 0.07;
    if(self.val < 0)
        Change(x, y, 1);
}

function CreateFractures(normal, fracture)
{
    return (self, x, y) => {
        self.val = 0;
        if(Math.random() < 0.03)
            self.val = 1;
        else
        {
            let tx = x + Math.floor(Math.random()*3)-1;
            let ty = y + Math.floor(Math.random()*3)-1;
            if(GetElement(tx,ty).id == self.id && GetElement(tx,ty).val == 1)
                self.val = 1;
        }
        if(self.val == 1) self.color = fracture;
        else self.color = normal;
    }
}

function TransformByChance(newId, chance)
{
    return (self, x, y) => {
        if(Math.random() < chance) Change(x, y, newId);
    }
}

/////////////////////////////////////////////////////////////////////

function LavaReactions(self, sx, sy, obj, ox, oy)
{
    if(obj.id == ElementIDs.water)
    {
        CombineElements(sx,sy,ox,oy,ElementIDs.obsidian);
        Change(ox, oy, ElementIDs.steam);
    }
    else if(obj.id == ElementIDs.stone && Math.random() < 0.03)
    {
        Change(ox, oy, ElementIDs.lava);
    }
}

function WaterReactions(self, sx, sy, obj, ox, oy)
{
    if(obj.id == ElementIDs.magma_stone)
    {
        CombineElements(ox,oy,sx,sy,ElementIDs.stone);
        Change(sx, sy, ElementIDs.steam);
    }
}

/////////////////////////////////////////////////////////////////////

elements = [
{
    name: "border",
    locked: true,
    mass: 999,
    Awake: (self, x, y) => self.color = rgb(255,255,255),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "void",
    mass: 0,
    Awake: (self, x, y) => self.color = rgb(0,0,0),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "sand",
    mass: 2,
    Awake: (self, x, y) => self.color = MixColors(rgb(214,131,79), rgb(163,82,51)),
    Update: Fall,
    Draw: JustRepaint
},
{
    name: "stone",
    mass: 999,
    Awake: CreateFractures(rgb(160,160,160), rgb(96,96,96)),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "water",
    mass: 1,
    Awake: (self, x, y) => { 
        self.density = 1;
        self.color = MixColors(rgb(98,147,175), rgb(113,172,176));
    },
    Update: Unite(Check(WaterReactions), SimulateLiquid),
    Draw: JustRepaint
},
{
    name: "fire",
    mass: 1,
    Awake: (self, x, y) => self.val = 0.5+Math.random()*0.5,
    Update: BeFire,
    Draw: (self, x, y) => Repaint(x, y, rgb(120 + Math.floor(self.val*66),50,0))
},
{
    name: "glass",
    mass: 999,
    unlockAtLevel: 10,
    Awake: (self, x, y) => self.color = MixColors(rgb(201,220,226), rgb(151,170,176)),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "steam",
    mass: 0.5,
    unlockAtLevel: 5,
    Awake: (self, x, y) => self.color = rgb(200,200,200),
    Update: Unite(TransformByChance(4, 0.001), FlyUp),
    Draw: JustRepaint
},
{
    name: "magma stone",
    mass: 999,
    Awake: CreateFractures(rgb(100,0,0), rgb(200,10,10)),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "obsidian",
    mass: 999,
    Awake: CreateFractures(rgb(46,41,58), rgb(91,73,101)),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "lava",
    mass: 3,
    Awake: (self, x, y) => self.color = MixColors(rgb(170,70,70), rgb(150,00,0)),
    Update: Unite(TransformByChance(8, 0.0001), Check(LavaReactions), SimulateLiquid),
    Draw: JustRepaint
}
];

/////////////////////////////////////////////////////////////////////

for(let i = 0; i < elements.length; i++)
    ElementIDs[elements[i].name.replace(" ", "_")] = i;

StartGameLoop();
CreateElementButtons();