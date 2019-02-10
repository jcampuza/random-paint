class Point {
  constructor(public x: number, public y: number) {}

  translate(x: number, y: number) {
    return new Point(this.x + x, this.y + y);
  }
}

class Square {
  constructor(
    public origin: Point,
    public length: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(this.origin.x + this.length, this.origin.y);
    ctx.lineTo(this.origin.x + this.length, this.origin.y + this.length);
    ctx.lineTo(this.origin.x, this.origin.y + this.length);
    ctx.lineTo(this.origin.x, this.origin.y);

    ctx.strokeStyle = "transparent";
    ctx.fillStyle = this.color;

    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

class Cross {
  constructor(
    public origin: Point,
    public length: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    const middle = new Square(this.origin, this.length, this.color);
    const top = new Square(
      this.origin.translate(0, -1 * this.length),
      this.length,
      this.color
    );
    const bottom = new Square(
      this.origin.translate(0, this.length),
      this.length,
      this.color
    );
    const left = new Square(
      this.origin.translate(-1 * this.length, 0),
      this.length,
      this.color
    );
    const right = new Square(
      this.origin.translate(this.length, 0),
      this.length,
      this.color
    );

    middle.draw(ctx);
    top.draw(ctx);
    bottom.draw(ctx);
    left.draw(ctx);
    right.draw(ctx);
  }
}

function getColor() {
  const idx = Math.floor(Math.random() * 5);

  return ["red", "blue", "green", "purple", "black"][idx];
}

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

const sleep = ms => new Promise(res => setTimeout(res, ms));

function createGame() {
  let sideLength = 20;
  let offset = 0;
  let isRunning = false;
  let speed = 30;

  function setOffset(value) {
    offset = value;
  }

  function setSpeed(value) {
    speed = value;
  }

  function setSideLength(value) {
    sideLength = value;
  }

  function getIsRunning() {
    return isRunning;
  }

  async function draw(offset) {
    let x = 0;
    let y = offset;

    while (true) {
      if (y > canvas.height) {
        break;
      }

      // ctx.clearRect(x, y, sideLength * 3, sideLength * 3);
      const cross = new Cross(new Point(x, y), sideLength, getColor());
      cross.draw(ctx);

      await sleep(speed);
      x += sideLength * 3;

      if (x > canvas.width) {
        x = 0;
        y = y + sideLength * 3;
      }
    }
  }

  async function start() {
    let offset = 0;
    isRunning = true;
    while (isRunning) {
      await draw(offset);
      offset += sideLength;

      if (offset >= canvas.height) {
        offset = 0;
      }
    }
  }

  function stop() {
    isRunning = false;
  }

  return {
    start,
    stop,
    getIsRunning,
    setSideLength,
    setOffset,
    setSpeed
  };
}

const game = createGame();

const canvasInput = <HTMLInputElement>document.getElementById("canvas-size");
const boxInput = <HTMLInputElement>document.getElementById("box-size");
const speedInput = <HTMLInputElement>document.getElementById("speed");
const toggleButton = <HTMLButtonElement>document.getElementById("toggle");
const clearButton = <HTMLButtonElement>document.getElementById("clear");

canvasInput.addEventListener("change", e => {
  const target = <HTMLInputElement>event.target;
  canvas.width = Number(target.value);
  canvas.height = Number(target.value);
});

boxInput.addEventListener("change", e => {
  const target = <HTMLInputElement>event.target;
  const value = Number(target.value);
  console.log(value);
  game.setSideLength(value);
});

speedInput.addEventListener("input", e => {
  const target = <HTMLInputElement>event.target;
  const value = Number(target.value);
  console.log(value);
  game.setSpeed(value);
});

toggleButton.addEventListener("click", () => {
  if (game.getIsRunning()) {
    game.stop();
  } else {
    game.start();
  }
});

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

game.start();
