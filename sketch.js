const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math"); //linear interpolation?
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const colorNum = random.rangeFloor(3, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorNum);
  // uv space: coord between 0-1
  function createGrid() {
    const points = [];
    const count = 25;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1); //count explode when div with 0 lol
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = random.noise2D(u, v) * 0.25;
        points.push({
          rotate: random.noise2D(u, v) * 0.5,
          color: random.pick(palette),
          pos: [u, v],
          rad: Math.abs(radius),
        });
      }
    }
    return points;
  }
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context: ctx, width: w, height: h }) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    points.forEach(({ pos: [u, v], rad, color, rotate }) => {
      const x = lerp(margin, w - margin, u);
      const y = lerp(margin, h - margin, v);

      // ctx.beginPath();
      // ctx.arc(x, y, rad * w, 0, Math.PI * 2, false);
      // ctx.strokeStyle = "black";
      // ctx.lineWidth = 8;
      // ctx.fillStyle = color;
      // ctx.fill();
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = `${rad * w}px "Arial"`;
      ctx.translate(x, y);
      ctx.rotate(rotate);
      ctx.fillText("=", 0, 0);
      ctx.restore();
    });
  };
};

canvasSketch(sketch, settings);
