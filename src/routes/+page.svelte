<script>
  import PythonTerminalTest from "../components/PythonTerminalTest.svelte";
  import PythonTerminal from "../components/PythonTerminal.svelte";
  import { onMount, tick } from "svelte";
  // import sprite from "../components/spriteclass.js"

  const width = screen.width * 0.9;
  const height = (screen.height * 2) / 3 - 95;
  let canvas, ctx;
  const gravity = 0.02;



  class sprite {
    constructor (position, size) {
      this.position = {
        x: screen.width - width + position[0],
        y: position[1],
      };
      this.width = size[0];
      this.height = size[1];
      this.speed = {
        x: 0,
        y: 0,
      }
    

      this.spriteImg = NaN;
      this.gravity = true;
      this.onGround = false;
    }

    update() {   
      this.draw();

      if (this.position.y + this.height*3/2 > height) {
        this.position.y = height - this.height*3/2;
        this.onGround = true;
      }
      if (this.onGround) 
        this.speed.y = 0;

      if (this.gravity && !this.onGround) 
        this.speed.y += gravity;
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;


      
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      // if (this.spriteImg === NaN) 
      // {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x + this.width / 2 , this.position.y + this.height / 2, this.width, this.height);
        console.log(this.spriteImg);
      // }

      // else {
      //   // ctx.drawImage(this.spriteImg, this.position.x, this.position.y)
      //   console.log(this.spriteImg);
      // }
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

  };



  onMount(async () => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    await tick();
    animate();
    console.log(width, height);
    myObject.setSpeedX(1);
    myObject.setSpeedY(-2);
    

  });


  let myObject = new sprite([100,100],[75,100]);

  function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect((screen.width - canvas.width), 0, canvas.width, canvas.height);
    myObject.update();
  }

  // setTimeout(()=> {myObject.moveTo([0,0])}, 5000);
  setTimeout(()=> {myObject.setSpeedY(-3);}, 4000);
  setTimeout(()=> {myObject.setSpeedX(0);}, 8000);
</script>

<body>
  <canvas id="gameCanvas" />
  <PythonTerminalTest />
</body>


