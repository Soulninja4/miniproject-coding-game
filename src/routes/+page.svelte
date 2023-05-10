<script>
  import PythonTerminal from "../components/PythonTerminal.svelte";
  import { onMount, onDestroy } from "svelte";
  import { outputText } from "../components/stores";

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

    kill(text) {
      // console.log("first");
      if (text === "test") {
        console.log("first");
        // Remove the reference to the Monster object
        this.velocity = null;
        this.position = null;
        this.image = null;
        this.draw = null;
        this.speak = null;
      }
    }

    speak(text) {
      const bubblePadding = 10;
      const bubbleMargin = 5;

      // Set styles for the speech bubble
      c.fillStyle = "white";
      c.strokeStyle = "black";
      c.font = "20px Arial";

      // Measure the width and height of the text
      const textWidth = c.measureText(text).width;
      const textHeight = parseInt(c.font, 10); // Assumes font size is set

      // Calculate the speech bubble dimensions
      const bubbleWidth = textWidth + bubblePadding * 2;
      const bubbleHeight = textHeight + bubblePadding * 2;

      // Calculate the speech bubble position
      const bubbleX = this.position.x + this.image.width / 2;
      const bubbleY = this.position.y;

      // Draw the speech bubble
      c.beginPath();
      c.moveTo(bubbleX + bubbleMargin, bubbleY);
      c.lineTo(bubbleX + bubbleWidth - bubbleMargin, bubbleY);
      c.quadraticCurveTo(
        bubbleX + bubbleWidth,
        bubbleY,
        bubbleX + bubbleWidth,
        bubbleY + bubbleMargin
      );
      c.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - bubbleMargin);
      c.quadraticCurveTo(
        bubbleX + bubbleWidth,
        bubbleY + bubbleHeight,
        bubbleX + bubbleWidth - bubbleMargin,
        bubbleY + bubbleHeight
      );
      c.lineTo(bubbleX + bubbleMargin, bubbleY + bubbleHeight);
      c.quadraticCurveTo(
        bubbleX,
        bubbleY + bubbleHeight,
        bubbleX,
        bubbleY + bubbleHeight - bubbleMargin
      );
      c.lineTo(bubbleX, bubbleY + bubbleMargin);
      c.quadraticCurveTo(bubbleX, bubbleY, bubbleX + bubbleMargin, bubbleY);
      c.closePath();

      c.fill();
      c.stroke();

      // Draw the text inside the speech bubble
      c.fillStyle = "black";
      c.fillText(text, bubbleX + bubblePadding, bubbleY + bubblePadding * 2);
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
      x: 1800,
      y: 525,
    },
    imageSrc: "src/assets/enemies/1.png",
    velocity: {
      x: -0.5,
      y: 0,
    },
  });

  let canvas, c;
  let answer = "";

  onMount(() => {
    outputText.subscribe((value) => {
      answer = value;
    });
    canvas = document.getElementById("gameCanvas");
    canvas.width = width;
    canvas.height = height;
    c = canvas.getContext("2d");

    function animate() {
      if (answer === "test") {
        console.log("correct");
      }
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);

      background.update();
      c.fillStyle = "rgba(255, 255, 255, 0)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      monster.update();
      monster.speak(answer);
      console.log(answer);
    }
    animate();
  });
</script>

<body class="bg-teal-500">
  <canvas id="gameCanvas" />
  <PythonTerminal />
</body>
