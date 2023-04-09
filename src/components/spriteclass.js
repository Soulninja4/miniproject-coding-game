

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


      this.draw();
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      if (this.spriteImg == NaN) 
      {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x + this.width / 2 , this.position.y + this.height / 2, this.width, this.height);
        console.log(this);
      }

      else {
        // ctx.drawImage(this.spriteImg, this.position.x, this.position.y)
        console.log(this.spriteImg);
      }
    }

    setSpeedX(speed) {
      this.speed.x = speed;      
    } 
    setSpeedY(speed) {
      if (!this.onGround)
        this.speed.y = speed;      
    }

    accelerate(speed) {
      this.speed.x += speed[0];
      this.speed.y += speed[1];
    } 

  };


