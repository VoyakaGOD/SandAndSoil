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
},
{
    name: "stone",
    Awake: (self, x, y) => {
        self.val = 1;
        if(Math.random() < 0.03)
            self.val = 0;
        else
        {
            let tx = x + Math.floor(Math.random()*3)-1;
            let ty = y + Math.floor(Math.random()*3)-1;
            if(GetElement(tx,ty).id == self.id && GetElement(tx,ty).val == 0)
                self.val = 0;
        }
        self.color = rgb(self.val*64 + 96, self.val*64 + 96, self.val*64 + 96);
    },
    Update: (self, x, y) => {},
    Draw: (self, x, y) => Repaint(x,y,self.color)
}
];

requestAnimationFrame(Draw);
CreateElementButtons();