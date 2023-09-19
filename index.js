//Dealing with Canvas
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var flex=document.querySelector('.border');
var tx = flex.clientWidth;
var ty = flex.clientHeight;

canvas.width = tx;
canvas.height = ty;

function randomColor() {
  return (Math.floor(Math.random() * 7)+2);
}

function Ball() {
  this.radius = Math.random() * 20 + ty/50;
  this.imageURL= "./images/"+randomColor()+".png";
  this.startradius = this.radius;
  this.x = tx/2;
  this.y = ty/2;
  this.dy = (Math.random() - 0.5) ;
  this.dx = (Math.random() - 0.5);
  this.update = function() {
    let newImage=document.createElement("img");
    newImage.src=this.imageURL;
    c.filter='grayscale(100)';
    c.drawImage(newImage, this.x, this.y, this.radius*4, this.radius*4);

  };
}

var bal = [];
for (var i=0; i<30; i++){
    bal.push(new Ball());
}

function animate() {    
  if (tx != flex.clientWidth || ty != flex.clientHeight) {
    tx = flex.clientWidth;
    ty = flex.clientHeight;
    canvas.width = tx;
    canvas.height = ty;
  }


  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);
  for (var i = 0; i < bal.length; i++) {
      bal[i].update();

      bal[i].y += bal[i].dy;
      bal[i].x += bal[i].dx;
      if (bal[i].y + 4*bal[i].radius > ty || bal[i].y < 0) {
          bal[i].dy = -bal[i].dy;
      }    
      if(bal[i].x + 4*bal[i].radius > tx || bal[i].x < 0){
          bal[i].dx = -bal[i].dx;
      }
      
  }
}

animate();


