const ElementIDs = {};

function MixColors(first, second)
{
    let rnd = Math.random();
    return rgb(first.r*rnd + second.r*(1-rnd),first.g*rnd + second.g*(1-rnd),first.b*rnd + second.b*(1-rnd));
}

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
        if(GetElement(x+1,y).src.mass < self.src.mass) np = {x:x+1, y:y};
    }
    else
    {
        if(GetElement(x-1,y).src.mass < self.src.mass) np = {x:x-1, y:y};
    }
    if(GetElement(x,y+1).src.mass < self.src.mass) np = {x:x, y:y+1};
    Swap(x, y, np.x, np.y);
}

function FlyUp(self, x, y)
{
    if(Math.random() < 0.5) return;
    dx = 1 - Math.floor(Math.random() * 3);
    if(GetElement(x+dx,y-1).id == ElementIDs.void)
        Swap(x,y,x+dx,y-1);
    else if(GetElement(x+dx,y-1).id == ElementIDs.border)
        Change(x, y, 1);
}

function BeFire(self, x, y)
{
    dx = 1 - Math.floor(Math.random() * 3);
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
    Update: SimulateLiquid,
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
    Awake: (self, x, y) => self.color = rgb(201,220,226),
    Update: DoNothing,
    Draw: JustRepaint
},
{
    name: "steam",
    mass: 0,
    unlockAtLevel: 5,
    Awake: (self, x, y) => self.color = rgb(200,200,200),
    Update: FlyUp,
    Draw: JustRepaint
},
{
    name: "magma stone",
    mass: 999,
    Awake: CreateFractures(rgb(100,0,0), rgb(200,10,10)),
    Update: DoNothing,
    Draw: JustRepaint
}
];

for(let i = 0; i < elements.length; i++)
    ElementIDs[elements[i].name.replace(" ", "_")] = i;

StartGameLoop();
CreateElementButtons();