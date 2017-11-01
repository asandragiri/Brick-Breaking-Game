var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width=canvas.width;
var height=canvas.height;
var brickWidth=50;
var brickHeight=10;
var brickRows = 4;
var brickCols = 8;
var brickX=brickY=0;
var bRadius=10;
var bx=width/2;
var by=height-40;
var bSpeedX = 2;
var bSpeedY = -2;
var paddleLength = 100;
var paddleX = (width/2)-(paddleLength/2);
var paddleY = height-25;
var bricks = [];
var bricksLeft = brickRows*brickCols;
var score = 0;
var HighScore = 0;
var lives = 3;
var level = 0;
var randomSteelRow = Math.floor(Math.random() * brickRows);
var randomSteelCol = Math.floor(Math.random() * brickCols);
var randomMagicRow = Math.floor(Math.random() * brickRows);
var randomMagicCol = Math.floor(Math.random() * brickCols);
var Start=Pause=false;

document.getElementById("pausebut").setAttribute("style","visibility:hidden");

function initScreen(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.font = "32px Corsiva";
//ctx.fillText("", 10, 50);
	//ctx.font="28px Broadway";
	ctx.strokeStyle="white";
   ctx.strokeText("Brick Breaker Game",120,(height/3)-10);
   ctx.strokeText("Team 8",200,(height/2)+40);
   ctx.font = "18px Corsiva";
   ctx.fillStyle='white';
   ctx.fillText("Abhishek, Priyanka, Meghana, Swathi",(width/2)-130,(height/2)+70);
}
function drawBall(){
	var bGrad = ctx.createRadialGradient(bx,by,bRadius,bx-2, by+2, 1);
	bGrad.addColorStop(0,'red');
	bGrad.addColorStop(1,'white');
		ctx.beginPath();
		ctx.arc(bx, by, bRadius, 0, Math.PI*2,false);
		ctx.fillStyle = bGrad;
		ctx.fill();
		ctx.closePath();
	}
	
function moveBall(){
	if(bx + bSpeedX > canvas.width-bRadius || bx + bSpeedX < bRadius) {
			bSpeedX = -bSpeedX;
		}
		if(by + bSpeedY < bRadius) {
			bSpeedY = -bSpeedY;
		}
		else if(by + bSpeedY > paddleY-bRadius){
			if(bx > paddleX-bRadius && bx < paddleX + paddleLength + (2*bRadius)) {
				bSpeedY = -bSpeedY;
			}
			else {
				lives--;
					if(!lives){
							ctx.clearRect(0,0,width,height);
							ctx.font = "28px Corsiva";
							ctx.fillStyle = 'white';
							ctx.fillText("Game Over!!! ", (width/2)-100, height/2);
							document.getElementById("pausebut").setAttribute("src","./Icons/restartbut.ico");
					}
					else{
						bx = paddleX+10;
						by = height/2;
						bSpeedX=2;
					}
			}
		}
		bx+=bSpeedX;
		by+=bSpeedY;
}

function drawBrick(fx,fy,len,type){

 var Grad = ctx.createLinearGradient(fx,fy,fx+len,fy);
	if( type === 'brick'){
		Grad.addColorStop(0,'#B22222');
		Grad.addColorStop(0.1,'#FF7F50');
		Grad.addColorStop(0.2,'maroon');
		Grad.addColorStop(0.3,'#FF7F50');
		Grad.addColorStop(0.4,'maroon');
		Grad.addColorStop(0.5,'#FF7F50');
		Grad.addColorStop(0.6,'maroon');
		Grad.addColorStop(0.7,'#FF7F50');
		Grad.addColorStop(0.8,'maroon');
		Grad.addColorStop(0.9,'#FF7F50');
		Grad.addColorStop(1,'maroon');
	}
	else if( type === 'steelBrick'){
		Grad.addColorStop(1,'#caccce');
	}
	else if( type === 'magicBrick'){
		Grad.addColorStop(0,'#9400D3');
		Grad.addColorStop(0.2,'#4B0082');
		Grad.addColorStop(0.4,'#0000FF');
		Grad.addColorStop(0.7,'#00FF00');
		Grad.addColorStop(1,'#FFFF00');
	}
	else{
		Grad.addColorStop(0,'black'); //#0000ff
		Grad.addColorStop(0.3,'grey'); //#1e90ff
		Grad.addColorStop(0.8,' grey');
		Grad.addColorStop(1,'black');
	}

		ctx.beginPath();
		ctx.rect(fx,fy, len, brickHeight);
		ctx.closePath();	
		ctx.fillStyle = Grad;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(fx,fy);
		ctx.lineTo(fx+10, fy-10);
		ctx.lineTo(fx+len+10, fy-10);
		ctx.lineTo(fx+len, fy);
		ctx.closePath();
		ctx.fillStyle = Grad ;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(fx+len+10,fy-10);
		ctx.lineTo(fx+len+10, fy);
		ctx.lineTo(fx+len, fy+10);
		ctx.lineTo(fx+len, fy);
		ctx.closePath();
		ctx.fillStyle = Grad ;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		ctx.fill();
}

function drawPaddle(){
	drawBrick( paddleX, paddleY, paddleLength, 'paddle');
}

function movePaddle(){
    document.onkeydown=function(e){
	if(bricksLeft>0 && lives>0 && !Pause){
		if(e.keyCode==37 && paddleX > 0 )
		{
			paddleX-=10;
			drawPaddle(paddleX,paddleY,paddleLength);
		}
		if(e.keyCode==39 && (paddleX+paddleLength) != (canvas.width-bRadius))
		{
			paddleX+=10;
			drawPaddle(paddleX,paddleY,paddleLength);
		}   
	}
    }
}

function initBricks(){
	for(var c=0; c<brickCols; c++){
		bricks[c]=[];
		for(var r=0; r<brickRows; r++){
			if( r == randomSteelRow && c == randomSteelCol)
				bricks[c][r] = { x: 0, y: 0, bVisible:1, type: 'steelBrick'};
			else if( r == randomMagicRow && c == randomMagicCol )
				bricks[c][r] = { x: 0, y: 0, bVisible:1, type: 'magicBrick'};
			else
				bricks[c][r] = { x: 0, y: 0, bVisible:1, type: 'brick'};
		}
	}
}	

function drawBricks(){
	for(var c=0; c<brickCols; c++){
		for(var r=0; r<brickRows; r++){
		
			bricks[c][r].x = brickX = (c*brickWidth)+((c+1)*10);
			bricks[c][r].y = brickY = (r+1)*(30);
			
			if(bricks[c][r].bVisible==1){
				drawBrick(brickX,brickY,brickWidth,bricks[c][r].type);
			}
		}
	}
}

function brickCollision(){
	for(var c=0; c<brickCols; c++){
		for(var r=0; r<brickRows; r++){
		br = bricks[c][r];

			if( br.bVisible ==1 ){
				if( bx > br.x && bx < br.x + brickWidth && by > (br.y-bRadius) && by < (br.y + brickHeight + bRadius)){
					bSpeedY = -bSpeedY;
					if(br.type === 'steelBrick'){
						br.type = 'brick';
						score+=2;
					}
					else if(br.type === 'magicBrick'){
					br.bVisible = 0;
					score++;
					bricksLeft--;
						if(c>0){
							if(bricks[c-1][r].bVisible==1 ){
								bricks[c-1][r].bVisible = 0;
								score++;
								bricksLeft--;
								}
						}
						if(c < brickCols-1){
							if(bricks[c+1][r].bVisible==1 ){
								bricks[c+1][r].bVisible = 0;
								score++;
								bricksLeft--;
							}
						}
						if(r < brickRows-1){
							if(bricks[c][r+1].bVisible==1 ){
								bricks[c][r+1].bVisible = 0;
								score++;
								bricksLeft--;
							}
						}
						if(r > 0){
							if(bricks[c][r-1].bVisible==1){
								bricks[c][r-1].bVisible = 0;
								score++;
								bricksLeft--;
							}
						}
					}
					else{
						br.bVisible = 0;	
						score++;
						bricksLeft--;
					}
						if( bricksLeft == 0){
							if( lives>0 ){
								bSpeedX *= 2;
								bSpeedY *= 2;
								ctx.clearRect(0,0,width,height);
								ctx.font = "28px Corsiva";
								ctx.fillStyle = 'white';
								ctx.fillText("Your Score: "+ score, (width/2)-70, (height/3)-10);
								writeHighScore();
								document.getElementById("start").innerHTML="Continue";
								document.getElementById("start").setAttribute("style","visibility:visible");
							}
						}
				}
			}
		}
	}
}

function writeScore() {
    ctx.font = "14px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Score: " + score, width-70, 15);
}

function writeHighScore() {
	if( score > HighScore ){
		HighScore = score;
	}
    ctx.font = "14px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("High Score: "+ HighScore, (width/2), 15);
}

function writeLives() {
    ctx.font = "14px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Lives: "+lives, 10, 15);
	ctx.fillText("Level: " + level, width/4, 15);
}

function GameStart()
{
	Start=true;
	if(!lives){
		lives=3;
		score=0;
	}
	randomSteelRow = Math.floor(Math.random() * brickRows);
	randomSteelCol = Math.floor(Math.random() * brickCols);
	randomMagicRow = Math.floor(Math.random() * brickRows);
	randomMagicCol = Math.floor(Math.random() * brickCols);
	initBricks();
	bx=width/2;
	by=height-40;
	paddleX = (width/2)-(paddleLength/2);
	paddleY = height-25;
	bricksLeft = brickRows*brickCols;
	drawAll();	
}

function GamePause(){
	if(Start){
		if(Pause){
				Pause = false;
				document.getElementById("pausebut").setAttribute("src","./Icons/pausebut.ico");
				drawAll();
		}
		else{
				Pause = true;
				document.getElementById("pausebut").setAttribute("src","./Icons/playbut.ico");
		}
		if(!lives)
			GameStart();
	}
}

function drawLevels(){
	document.getElementById("start").setAttribute("style","visibility:hidden");
	document.getElementById("pausebut").setAttribute("style","visibility:visible");
	ctx.clearRect(0,0,width,height);
	ctx.font = "28px Corsiva";
	ctx.fillStyle = 'white';
	ctx.strokeText("Level - "+ (++level), (width/2)-50, (height/2));
}

initScreen();
initBricks();

function drawAll(){
	if(bricksLeft >0 && lives>0 ){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawPaddle();
		movePaddle();
		drawBricks();
		drawBall();
		moveBall();
		brickCollision();
		writeScore();
		writeLives();
		writeHighScore();
		if(Start){
			if(!Pause)
				requestAnimationFrame(drawAll);
		}
		
	}
}