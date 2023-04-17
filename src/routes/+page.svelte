<script>
  import PythonTerminalTest from "../components/PythonTerminalTest.svelte";
  import PythonTerminal from "../components/PythonTerminal.svelte";
  import { onMount, tick } from "svelte";
  // import {monster} from "../components/spriteclass"

  const width = screen.width * 0.95;
  const height = screen.height * 0.7;
  let canvas, ctx;
  const gravity = 0.08;

  let myObject, objimg;

  class sprite {
    constructor(position, size, spt = NaN) {
      this.position = {
        x: screen.width - width + position[0],
        y: position[1],
      };
      this.width = size[0];
      this.height = size[1];
      this.speed = {
        x: 0,
        y: 0,
      };

      this.spriteImg = spt;
      this.gravity = true;
      this.onGround = false;
    }

    update() {
      this.draw();

      if (this.position.y + this.height > height) {
        this.position.y = height - this.height;
        this.onGround = true;
      }
      if (this.onGround) this.speed.y = 0;

      if (this.gravity && !this.onGround) this.speed.y += gravity;
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
    }

    draw() {
      // ctx.beginPath();
      // ctx.moveTo(this.position.x, this.position.y);
      // console.log(this.spriteImg);

      if (typeof this.spriteImg == "number") {
        ctx.fillStyle = "red";
        ctx.fillRect(
          this.position.x + this.width / 2,
          this.position.y + this.height / 2,
          this.width,
          this.height
        );
        // console.log("not yo");
      } else {
        ctx.drawImage(this.spriteImg, this.position.x, this.position.y);
        // ctx.drawImage()
        // console.log("yo");
      }
    }

    moveTo(coord) {
      this.position.x = screen.width - width + coord[0];
      this.position.y = coord[1];
      this.onGround = false;
    }
    setSpeedX(speed) {
      this.speed.x = speed;
    }
    setSpeedY(speed) {
      // if (!this.onGround)
      this.speed.y = speed;
      this.onGround = false;
    }

    accelerate(speed) {
      this.speed.x += speed[0];
      this.speed.y += speed[1];
    }
  }

  class monster extends sprite {
    constructor(position, size, spt = NaN) {
      super(position, size, spt);
    }

    speak(text) {
      ctx.fillStyle = "white";
      ctx.fillText(text, this.position.x, this.position.y - 10);
      console.log(text, this.position.x);
    }
  }

  // export {ctx, sprite, gravity, width, height};

  onMount(async () => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    objimg = document.querySelector("#playimg");
    myObject = new monster([100, 100], [113, 200], objimg);

    await tick();
    setTimeout(animate(), 1000);
    console.log(width, height);
    myObject.setSpeedX(2);
    myObject.setSpeedY(-2);
  });

  var toAnimate = [];
  function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(screen.width - canvas.width, 0, canvas.width, canvas.height);
    myObject.update();
    if (toAnimate.length > 0) {
      toAnimate.forEach(function (parameters) {
        let func = parameters[0];
        let param = parameters.slice(1);
        func(...param);
      });
    }
  }

  // setTimeout(()=> {myObject.moveTo([0,0])}, 5000);
  setTimeout(() => {
    myObject.setSpeedY(-3);
  }, 2000);
  setTimeout(() => {
    myObject.setSpeedX(0);
  }, 4000);
  setTimeout(() => {
    toAnimate.push([myObject.speak.bind(myObject), "IAMHULK"]);
  }, 5000);
  // setTimeout(() => {
  // toAnimate.pop();
  // }, 7000);
</script>

<body class="bg-teal-500">
  <canvas id="gameCanvas" />
  <PythonTerminalTest />

  <img id="playimg" src="src\assets\Hulk.jpg" alt="" class="hidden" />
</body>
