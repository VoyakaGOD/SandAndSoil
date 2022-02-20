elements = [
{
    name: "void",
    Awake: (self, x, y) => {},
    Update: (self, x, y) => {},
    Draw: (self, x, y) => Repaint(x,y,rgb(0,0,0))
},
{
    name: "sand",
    Awake: (self, x, y) => self.color = rgb(128,Math.floor(Math.random()*128),13),
    Update: (self, x, y) => {
        if(GetElement(x,y+1).id == 0) Swap(x,y,x,y+1);
        else if(GetElement(x+1,y+1).id == 0 && GetElement(x+1,y).id == 0) Swap(x,y,x+1,y+1);
        else if(GetElement(x-1,y+1).id == 0 && GetElement(x-1,y).id == 0) Swap(x,y,x-1,y+1);
    },
    Draw: (self, x, y) => Repaint(x,y,self.color)
}
];

pause = false;
CreateElementButtons();