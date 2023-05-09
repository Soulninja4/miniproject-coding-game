<script>
  import PythonTerminal from "../components/PythonTerminal.svelte";
  import { onMount, onDestroy } from "svelte";

  const width = screen.width;
  const height = screen.height * 0.65;

  class Sprite {
    constructor({
      position,
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 },
    }) {
      this.position = position;
      this.width = 50;
      this.height = 150;
      this.image = new Image();
      this.image.src = imageSrc;
      this.scale = scale;
      this.framesMax = framesMax;
      this.framesCurrent = 0;
      this.framesElapsed = 0;
      this.framesHold = 10;
      this.offset = offset;
    }

    draw() {
      c.drawImage(
        this.image,
        //crop arg
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,

        //position arg
        this.position.x + this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        (this.image.height * this.scale) / 1.4
      );
    }

    animateFrame() {
      this.framesElapsed++;

      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++;
        } else {
          this.framesCurrent = 0;
        }
      }
    }

    update() {
      this.draw();
      // this.animateFrame();
    }
  }

  class Monster extends Sprite {
    constructor({ position, velocity, imageSrc }) {
      super({
        position,
        imageSrc,
      });

      this.velocity = velocity;
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "src/assets/bg.png",
    scale: 1.47,
  });

  const monster = new Monster({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "src/assets/enemies/1.png",
    velocity: {
      x: 5,
      y: 0,
    },
  });

  let canvas, c;

  onMount(() => {
    canvas = document.getElementById("gameCanvas");
    canvas.width = width;
    canvas.height = height;
    c = canvas.getContext("2d");

    function animate() {
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);

      background.update();
      c.fillStyle = "rgba(255, 255, 255, 0)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      monster.update();
    }
    animate();
  });
</script>

<body class="bg-teal-500">
  <canvas id="gameCanvas" />
  <PythonTerminal />
</body>
