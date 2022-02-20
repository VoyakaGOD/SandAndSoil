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

for(let i  =0; i < 10; i++)
    SetPixel(5+i,10,rgb(128,33,33));
UpdateCanvas();