// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 272;
document.body.appendChild(canvas);

var audio = new Audio('audio/song.mp3');
var boomFX = new Audio('audio/boom.wav'); 
var menuFX = new Audio('audio/menu.wav'); 
var shootFX = new Audio('audio/shoot.wav'); 
var deathFX = new Audio('audio/death.wav'); 


audio.loop=true;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

//bullets image
var bulletReady = false;
var bulletImage = new Image();
bulletImage.onload = function () {
	bulletReady = true;
};
bulletImage.src = "images/bullet.png";

//fx image
var fxReady = false;
var fxImage = new Image();
fxImage.onload = function () {
	fxReady = true;
};
fxImage.src = "images/explosion.png";

//title image
var titleReady = false;
var titleImage = new Image();
titleImage.onload = function () {
	titleReady = true;
};
titleImage.src = "images/titles.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 ,// movement in pixels per second
	invincible:false,
	elapsedShoot:0,
	currentFrame:0,
	startFrame:0,
	maxFrames:4,
	realFrame:0,
	elapsed:0,
	timeFrame:0.1,
	moving:false
};
var gameState={
	START:1,
	PLAY:2,
	END:3
}
var listOfBullets = [];
var listOfMonsters = [];
var listOfParticles = [];

var level=0;
var monsterSpawn=1;
var monstersKilled = 0;
var score=0;
var currentState=gameState.START;

// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height -32;
	if(currentState== gameState.START)
		hero.invincible=true;
	else
		hero.invincible=false;
	
	hero.currentFrame=0;
	hero.elapsed=0;
	hero.startFrame=4;
	hero.maxFrames=6;
	hero.timeFrame=0.05;
	
	level=1;
	monsterSpawn=1;
	monstersKilled=0;
	score=0;
	
	//clear lists
	listOfBullets.length = 0;
	listOfMonsters.length = 0;
	listOfParticles.length = 0;
	
	// Throw the monster somewhere on the screen randomly
	for(i=0; i < monsterSpawn;i++)
	{
		var posX=32 + Math.random() * (canvas.width - 64);
		listOfMonsters.push({x:posX, y:-64, size:128, vSpeed:150, hSpeed:120, gravity:2.5, elapsed:0,frameTime:0.05,currentFrame:0,maxFrames:4});
	}
	
};
//add next wave of monsters
var nextLevel = function () {
	level++;
	if(level < 13)
		monsterSpawn++;
	// Throw the monster somewhere on the screen randomly
	for(i=0; i < monsterSpawn;i++)
	{
		var posX=32 + Math.random() * (canvas.width - 64);
		listOfMonsters.push({x:posX, y:-64, size:128, vSpeed:150, hSpeed:120, gravity:2.5, elapsed:0,frameTime:0.05,currentFrame:0,maxFrames:4});
	}
	
};

var clamp = function(num, min, max) {
    return num < min ? min : (num > max ? max : num);
};
var circlecollision=function(x1,y1,r1,x2,y2,r2){
	var cx=(x1+r1)-(x2+r2);
	var cy=(y1+r1)-(y2+r2);
	return    Math.sqrt((cx*cx)+(cy*cy)) <= r1+r2 ;
};

// Update game objects
var update = function (modifier) {
	
	//update hero
	if(!hero.invincible){
	hero.moving=false;
	if(hero.elapsedShoot <= 0)
	{
		if (37 in keysDown) { // Player holding left
			hero.x=clamp(hero.x- hero.speed * modifier,0,canvas.width-32); 
			hero.moving=true;
		}
		else if (39 in keysDown) { // Player holding right
			hero.x=clamp(hero.x+ hero.speed * modifier,0,canvas.width-32); 
			hero.moving=true;
		}
		if (32 in keysDown) { // Player holding space
			hero.elapsedShoot=0.5;
			listOfBullets.push({x:hero.x+8, y:canvas.height-32,hSpeed:-256,isDead:false,angle:0,elapsed:0,frameTime:0.04,currentFrame:0,maxFrames:5});
			hero.currentFrame=0;
			hero.elapsed=0;
			hero.startFrame=10;
			hero.maxFrames=2;
			hero.timeFrame=0.05;
			shootFX.play();
		}
	}
	if(hero.elapsedShoot > 0)
	{
		hero.elapsedShoot-=modifier;
	}
	else
	{
		if(hero.moving && hero.startFrame != 4)
		{
			hero.currentFrame=0;
			hero.elapsed=0;
			hero.startFrame=4;
			hero.maxFrames=6;
			hero.timeFrame=0.05;
		}
		else if(!hero.moving && hero.startFrame != 0)
		{
			hero.currentFrame=0;
			hero.elapsed=0;
			hero.startFrame=0;
			hero.maxFrames=4;
			hero.timeFrame=0.1;
		}
	}
	hero.elapsed+=modifier;
	if(hero.elapsed >= hero.timeFrame)
	{
		hero.elapsed-=hero.timeFrame;
		hero.currentFrame=(hero.currentFrame+1)%hero.maxFrames;
		hero.realFrame=hero.currentFrame+hero.startFrame;
	}
	}
	//update monster
	for (i = 0; i < listOfMonsters.length; i++) { 
	
		//update animation 
		listOfMonsters[i].elapsed+=modifier;
		if(listOfMonsters[i].elapsed >= listOfMonsters[i].frameTime)
		{
			listOfMonsters[i].elapsed-=listOfMonsters[i].frameTime;
			listOfMonsters[i].currentFrame=(listOfMonsters[i].currentFrame+1)%listOfMonsters[i].maxFrames;
		}
		//update x
		listOfMonsters[i].x=clamp(listOfMonsters[i].x+ listOfMonsters[i].hSpeed * modifier,0,canvas.width-listOfMonsters[i].size); 
		if((listOfMonsters[i].x == 0) || (listOfMonsters[i].x == canvas.width-listOfMonsters[i].size))
			listOfMonsters[i].hSpeed*=-1;
		//update y
		listOfMonsters[i].vSpeed+=listOfMonsters[i].gravity;//add gravity to monster
		listOfMonsters[i].y=clamp(listOfMonsters[i].y+ listOfMonsters[i].vSpeed * modifier,-listOfMonsters[i].size,canvas.height-listOfMonsters[i].size); 
		if((listOfMonsters[i].y == canvas.height-listOfMonsters[i].size))
			listOfMonsters[i].vSpeed=clamp(listOfMonsters[i].vSpeed*-1,-256,-158);
		
		if(!hero.invincible && circlecollision(hero.x,hero.y,16,listOfMonsters[i].x,listOfMonsters[i].y,listOfMonsters[i].size/2)){
		
			listOfParticles.push({x:hero.x, y:hero.y, size:32,elapsed:0,frameTime:0.05,currentFrame:0,maxFrames:7});
			hero.invincible=true;
			currentState= gameState.END;
			boomFX.play();
			deathFX.play();
		}
		
	}
	
	//update bullets
	for (i = listOfBullets.length-1; i >= 0; i--) {
		//update animation 	
		listOfBullets[i].elapsed+=modifier;
		if(listOfBullets[i].elapsed >= listOfBullets[i].frameTime)
		{
			listOfBullets[i].elapsed-=listOfBullets[i].frameTime;
			listOfBullets[i].currentFrame=(listOfBullets[i].currentFrame+1)%listOfBullets[i].maxFrames;
		}
		//update movement
		listOfBullets[i].y+=listOfBullets[i].hSpeed * modifier;
		listOfBullets[i].angle+=0.1;
		//check collision against enemies
		for(h = listOfMonsters.length-1; h >= 0; h--) { 
			if(circlecollision(listOfBullets[i].x,listOfBullets[i].y,8,listOfMonsters[h].x,listOfMonsters[h].y,listOfMonsters[h].size/2))
			{
				score+=listOfMonsters[h].size*5;
				listOfBullets[i].isDead=true;
				//add particle
				listOfParticles.push({x:listOfMonsters[h].x, y:listOfMonsters[h].y, size:listOfMonsters[h].size,elapsed:0,frameTime:0.05,currentFrame:0,maxFrames:7});
				//split monsters
				if(listOfMonsters[h].size > 16)
				{
					var posX= listOfMonsters[h].x+Math.random()*32+4;
					var posY=listOfMonsters[h].y-Math.random()*16-10;
					listOfMonsters.push({x:posX, y:posY, size:listOfMonsters[h].size/2, vSpeed:listOfMonsters[h].vSpeed, hSpeed:listOfMonsters[h].hSpeed*1.25, gravity:listOfMonsters[h].gravity+0.4,elapsed:0,frameTime:0.05,currentFrame:0,maxFrames:4});
					posX= listOfMonsters[h].x-Math.random()*32-4;
					posY=listOfMonsters[h].y-Math.random()*16-10;
					listOfMonsters.push({x:posX, y:posY, size:listOfMonsters[h].size/2, vSpeed:listOfMonsters[h].vSpeed, hSpeed:-listOfMonsters[h].hSpeed*1.25, gravity:listOfMonsters[h].gravity+0.4,elapsed:0,frameTime:0.05,currentFrame:0,maxFrames:4});
				}
				boomFX.play();
				listOfMonsters.splice(h,1);
			}
		}
		if(listOfBullets[i].y < listOfBullets[i].size || listOfBullets[i].isDead)
			listOfBullets.splice(i,1);
	}
	
	//update particles
	for (i = listOfParticles.length-1; i >= 0; i--) { 
		listOfParticles[i].elapsed+=modifier;
		if(listOfParticles[i].elapsed >= listOfParticles[i].frameTime)
		{
			listOfParticles[i].elapsed-=listOfParticles[i].frameTime;
			listOfParticles[i].currentFrame=(listOfParticles[i].currentFrame+1)%listOfParticles[i].maxFrames;
		}
		if(listOfParticles[i].currentFrame == listOfParticles[i].maxFrames-1)
			listOfParticles.splice(i,1);
	}	
	
	//game level logic
	if(listOfMonsters.length <= 0)
		nextLevel();
	
	if(currentState== gameState.START || currentState== gameState.END)
		if (13 in keysDown){
			currentState= gameState.PLAY;
			menuFX.play();
			reset();
		 }
};

// Draw everything
var render = function () {

	// Score , font settings
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	if (heroReady && !hero.invincible) {
		ctx.drawImage(heroImage,(hero.realFrame%6)*32,Math.floor(hero.realFrame/6)*32,32,32, hero.x, hero.y,32,32);
	}
	if(bulletReady){
		listOfBullets.forEach(function(entry){ctx.drawImage(bulletImage,entry.currentFrame*16,0,16,16, entry.x, entry.y,16,16)});
	}
	
	if (monsterReady) {
		listOfMonsters.forEach(function(entry){ctx.drawImage(monsterImage,entry.currentFrame*128,0,128,128,entry.x, entry.y,entry.size,entry.size)});
	}
	if(fxReady){
		listOfParticles.forEach(function(entry){ctx.drawImage(fxImage,entry.currentFrame*64,0,64,64,entry.x, entry.y,entry.size,entry.size)});
	}
	if(titleReady){
		if(currentState== gameState.START)
			ctx.drawImage(titleImage,0,0,480,148, 10, 40,480,148);
		else if(currentState== gameState.END)
		{
			ctx.font = "22px Orator std";
			ctx.fillText("Your Final score was: "+score, 80, 155);
			ctx.drawImage(titleImage,0,148,480,148, 10, 40,480,148);
		}
		
		if(currentState!= gameState.PLAY){	
		ctx.font = "22px Orator std";
		ctx.fillText("press Enter to start", 120, 240);
		}
	}
	
	ctx.textAlign = "right";
	ctx.font = "24px Orator std";
	ctx.fillText(score, 470, 5);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// start the game
var then = Date.now();
reset();
main();
audio.play();
