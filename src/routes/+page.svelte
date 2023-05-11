<script>
  import PythonTerminal from "../components/PythonTerminal.svelte";
  import Tutorial from "../components/Tutorial.svelte";
  import { onMount, onDestroy } from "svelte";
  import { outputText } from "../components/stores";
  import { convertEncoding, compareStringEncoding } from "../components/utils";
  const width = screen.width;
  const height = screen.height * 0.65;
  let gameState = "tutorial1";
  let level = "1";

  let leftDome = 700;
  let rightDome = 1000;

  let hp = 100;

  let currentPage = 1;
  const totalPages = 3;

  function onNextPage() {
    if (currentPage !== totalPages) {
      currentPage++;
    } else {
      gameState = "playing";
      currentPage = 1;
    }
  }

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

  class Dome extends Sprite {
    constructor({ position, imageSrc, scale }) {
      super({
        position,
        imageSrc,
        scale,
      });
    }
    checkHealth() {
      switch (true) {
        case hp <= 0:
          this.image.src = "src/assets/dome/domedead.png";
          break;
        case hp < 30:
          this.image.src = "src/assets/dome/dome2.png";
          break;
        case hp < 60:
          this.image.src = "src/assets/dome/dome1.png";
          break;
        case hp <= 100:
          this.image.src = "src/assets/dome/dome0.png";
          break;
      }
    }

    update() {
      this.checkHealth();
      this.draw();
    }
  }

  class Monster extends Sprite {
    constructor({ position, velocity, imageSrc, key = "undefined", scale }) {
      super({
        position,
        imageSrc,
        scale,
      });

      this.velocity = velocity;
      this.isVisible = true;
      this.isDead = false;
      this.key = key;
    }
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    }

    hide() {
      this.isVisible = false;
    }

    blinkAndDisappear() {
      if (this.isDead) return;
      const blinkDuration = 100; // Duration of each blink (in milliseconds)
      const totalBlinks = 10; // Number of blinks
      let blinkCount = 0;

      const blinkInterval = setInterval(() => {
        if (blinkCount < totalBlinks) {
          this.toggleVisibility(); // Toggle sprite visibility (implement the `toggleVisibility()` method accordingly)
          blinkCount++;
        } else {
          clearInterval(blinkInterval);
          this.hide(); // Hide the sprite (implement the `hide()` method accordingly)
        }
      }, blinkDuration);
    }

    kill(text) {
      if (text === this.key) {
        this.blinkAndDisappear();
        this.isDead = true;
      }
    }

    attack() {
      if (this.isDead) return;
      if (this.velocity.x > 0) {
        if (this.position.x + this.width >= leftDome) {
          this.velocity.x = 0;
          hp -= 0.2;
        }
      } else {
        if (this.position.x <= rightDome) {
          this.velocity.x = 0;
          hp -= 0.2;
        }
      }
    }

    speak() {
      if (this.isDead) return;
      const bubblePadding = 10;
      const bubbleMargin = 5;

      // Set styles for the speech bubble
      c.fillStyle = "white";
      c.strokeStyle = "black";
      c.font = "20px Arial";

      // Measure the width and height of the text
      const textWidth = c.measureText(this.key).width;
      const textHeight = parseInt(c.font, 10); // Assumes font size is set

      // Calculate the speech bubble dimensions
      const bubbleWidth = textWidth + bubblePadding * 2;
      const bubbleHeight = textHeight + bubblePadding * 2;

      // Calculate the speech bubble position
      const bubbleX = this.position.x + 20;
      const bubbleY = this.position.y - 20;

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
      c.fillText(
        this.key,
        bubbleX + bubblePadding,
        bubbleY + bubblePadding * 2
      );
    }

    update() {
      // if (this.isDead) return;
      if (this.isVisible) {
        this.draw();
        this.attack();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
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

  const foreground = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "src/assets/fg.png",
    scale: 1.47,
  });

  const dome = new Dome({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "src/assets/dome/dome0.png",
    scale: 1.47,
  });

  // LEVEL 1 MONSTERS
  const level1monster1 = new Monster({
    position: {
      x: 1800,
      y: 525,
    },
    imageSrc: "src/assets/enemies/1.png",
    velocity: {
      x: -0.5,
      y: 0,
    },
    key: "Hello, World!",
  });

  const level1monster2 = new Monster({
    position: {
      x: -300,
      y: 525,
    },
    imageSrc: "src/assets/enemies/2.png",
    velocity: {
      x: 0.5,
      y: 0,
    },
    key: "723",
  });

  const level1monster3 = new Monster({
    position: {
      x: -600,
      y: 525,
    },
    imageSrc: "src/assets/enemies/1.png",
    velocity: {
      x: 0.5,
      y: 0,
    },
    key: "How will you handle us",
  });

  const level1monster4 = new Monster({
    position: {
      x: 2400,
      y: 525,
    },
    imageSrc: "src/assets/enemies/1.png",
    velocity: {
      x: -0.5,
      y: 0,
    },
    key: "At the same time!",
  });

  let canvas, c;

  onMount(() => {
    canvas = document.getElementById("gameCanvas");
    canvas.width = width;
    canvas.height = height;
    c = canvas.getContext("2d");

    function animate() {
      window.requestAnimationFrame(animate);
      if (gameState == "playing") {
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);

        background.update();
        foreground.update();
        dome.update();
        c.fillStyle = "rgba(255, 255, 255, 0)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        if (level == "1") {
          level1monster1.update();
          level1monster2.update();
          level1monster3.update();
          level1monster4.update();

          level1monster1.speak($outputText);
          level1monster2.speak($outputText);
          level1monster3.speak($outputText);
          level1monster4.speak($outputText);

          level1monster1.kill($outputText);
          level1monster2.kill($outputText);
          level1monster3.kill($outputText);
          level1monster4.kill($outputText);

          if (
            level1monster1.isDead &&
            level1monster2.isDead &&
            level1monster3.isDead &&
            level1monster4.isDead
          ) {
            gameState = "tutorial2";
          }
        }
      } else {
      }
    }
    animate();
  });
</script>

<body class="bg-teal-500">
  <div id="gameContainer">
    <Tutorial {currentPage} {totalPages} {onNextPage} {gameState} />
    <canvas id="gameCanvas" />
  </div>
  <PythonTerminal />
</body>
