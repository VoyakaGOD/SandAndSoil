const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const buffer = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
for(var i = 0; i < buffer.data.length; i += 4)
{
    buffer.data[i] = 0;
    buffer.data[i+1] = 0;
    buffer.data[i+2] = 0;
    buffer.data[i+3] = 255;
}
ctx.putImageData(buffer, 0, 0);

function rgb(r, g, b)
{
    return {r, g, b};
}

function SetPixel(x, y, color)
{
    let p = 4*x + 4*CANVAS_WIDTH*y;
    buffer.data[p] = color.r;
    buffer.data[p + 1] = color.g;
    buffer.data[p + 2] = color.b;
}

function UpdateCanvas()
{
    ctx.putImageData(buffer, 0, 0);
}

/////////////////////////////////////////////////////////////////////

const GAME_WIDTH = 128;
const GAME_HEIGHT = 128;
const BORDER_ID = 0;
const VOID_ID = 1;

var elements = [];
const gameTable = [];

function CreateInstance(id)
{
    return {id, src: elements[id]};
}

function Repaint(x, y, color)
{
    for(let j = 0; j < 4; j++)
        for(let i = 0; i < 4; i++)
            SetPixel(4*x+i,4*y+j,color);
}

function IsCorrect(x, y)
{
    if(x < 0 || x >= GAME_WIDTH || y >= GAME_HEIGHT || y < 0)
        return false;
    return true;
}

function GetElement(x, y)
{
    if(!IsCorrect(x, y))
        return CreateInstance(BORDER_ID);
    return gameTable[y][x];
}

var elementsCombined = () => {};

function CombineElements(x1, y1, x2, y2, resultId)
{
    gameTable[y1][x1] = CreateInstance(resultId);
    elements[resultId].Awake(gameTable[y1][x1], x1, y1);
    gameTable[y2][x2] = CreateInstance(VOID_ID);
    elements[VOID_ID].Awake(gameTable[y2][x2], x2, y2);
    elementsCombined();
}

function Change(x, y, id)
{
    if(!IsCorrect(x, y)) return;

    gameTable[y][x] = CreateInstance(id);
    elements[id].Awake(gameTable[y][x], x, y);
}

function Swap(x1, y1, x2, y2)
{
    let tmp =  gameTable[y1][x1];
    gameTable[y1][x1] = gameTable[y2][x2];
    gameTable[y2][x2] = tmp;
}

/////////////////////////////////////////////////////////////////////

var mpx = 0;
var mpy = 0;
var pressed = false;
var brushSize = 7;
var brushId = 2;
var pause = false;
var replacement = true;

canvas.addEventListener('mousemove', (event) => {
	mpx = Math.floor(event.offsetX/4);
	mpy = Math.floor(event.offsetY/4);
});

canvas.addEventListener('mousedown', (event) => {
	pressed = true;
});

canvas.addEventListener('mouseup', (event) => {
	pressed = false;
});

canvas.addEventListener("mouseout", (event) => {
    pressed = false;
});

var inverseUpdateDirection = false;

function Draw()
{
    for(let y = GAME_HEIGHT-1; y >= 0; y--)
    {
        for(let sx = 0; sx < GAME_WIDTH; sx++)
        {
            let x = sx;
            if(inverseUpdateDirection) x = GAME_WIDTH - sx - 1;
            if(pressed && ((x-mpx)*(x-mpx)+(y-mpy)*(y-mpy) < brushSize*brushSize) && (replacement || gameTable[y][x].id != brushId))
            {
                gameTable[y][x] = CreateInstance(brushId);
                elements[gameTable[y][x].id].Awake(gameTable[y][x], x, y);
            }

            if(!pause)
                elements[gameTable[y][x].id].Update(gameTable[y][x], x, y);
        }
    }

    inverseUpdateDirection = !inverseUpdateDirection;

    for(let y = GAME_HEIGHT-1; y >= 0; y--)
        for(let x = 0; x < GAME_WIDTH; x++)
            elements[gameTable[y][x].id].Draw(gameTable[y][x], x, y);
    
    UpdateCanvas();
    requestAnimationFrame(Draw);
}

function StartGameLoop()
{
    for(let y = 0; y < GAME_HEIGHT; y++)
    {
        let row = [];
        for(let x = 0; x < GAME_WIDTH; x++)
            row.push(CreateInstance(VOID_ID));
        gameTable.push(row);
    }

    for(let y = GAME_HEIGHT-1; y >= 0; y--)
        for(let x = 0; x < GAME_WIDTH; x++)
            elements[gameTable[y][x].id].Awake(gameTable[y][x], x, y);

    requestAnimationFrame(Draw);
}