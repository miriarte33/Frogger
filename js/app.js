let score = 0; 
window.onload = function() {
	alert('Welcome to my version of the Frogger arcade game! Press "OK" to play');
}

//Returns value at a random index  
function randomIndex(arr) {
	return arr[Math.floor((Math.random() * arr.length))];  
}

//Creates 3 enemies on the screen
function createEnemies(amount = 3) {
	for (let i=0; i<amount; i++) {
		allEnemies.push(new Enemy()); 
	}
}

//Creates one gem with the desired image
function createGems(image = 'gem-blue.png') {
	gems.push(new Gem(image));
}

// Class for the enemies the player cannot hit
class Enemy {
	constructor() {
		this.sprite = 'images/car.png'; 
		this.speed = Math.floor((Math.random()*250) + 100);
		this.x = 0;
		this.y = randomIndex([60, 145, 230]);
		this.width = 101; 
		this.height = 171;
	}

	// Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
	update(dt) {
		// You should multiply any movement by the dt parameter which will ensure the game runs at the same speed for all computers
		this.x += this.speed * dt; 
		if (this.x > 505) { //redo the enemies position once it goes off canvas
			this.x = 0;
			this.y = randomIndex([60, 145, 230]);
			this.speed = Math.floor((Math.random()*250) + 100);
		}
		
		//handle collision detection
		//recieved help from udacity student-helpers 'lloan' and 'mvalentin' on slack
		const center = this.width/2; 
		if (this.x + center > player.x && this.x - center < player.x && this.y + center > player.y && this.y - center < player.y) { // compare if the player is in the this's "personal space" i.e hitting its center
			player.reset();
			score = 0; 
			allEnemies.splice(3); // restart enemies to 3 if the player loses
			gems.pop() // remove gem if the player loses
			scoreCounter.textContent = `Score: ${score}`; 
			alert('You Lose'); 
		}
	}
	// Draw the enemy on the screen, required method for game
	render() {
    	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

// Now write your own player class
// This class requires an update(), render() and a handleInput() method.
class Player {
	constructor() {
		this.sprite = 'images/char-boy.png';
		this.speed = 10; 
    	this.x = 200;
    	this.y = 390;
		this.width = 101; 
		this.height = 171; 
		this.timesWon = 0; 
	}
	
	update() {
		// reset the player if they win and update their score 
		if (this.y == -35) {
			score++; 
			this.timesWon++; 
			scoreCounter.textContent = `Score: ${score}`;
			this.reset();
			if (this.timesWon % 5 === 0 && this.timesWon !== 0 && this.timesWon !== 45) { //We need to cap out the amount of enemies so that the game never gets too difficult 
				createEnemies(1);
			}
			if (score % 3 === 0 && score !== 0) {
				const color = randomIndex(['gem-blue.png', 'gem-orange.png', 'gem-green.png']);  
				createGems(color); 
			} else {
				gems.pop(); // Remove the gem if the player does not pick it up on the same turn it appears 
			}
		}
	}
	
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
	
	handleInput(userInput) {
		if (userInput == 'left' && this.x > 0) {
			this.x -= 100; 
		} else if (userInput == 'right' && this.x < 400) {
			this.x += 100; 
		} else if (userInput == 'up' && this.y > -35) {
			this.y -= 85; 
		} else if (userInput == 'down' && this.y < 390) {
			this.y += 85; 
		}
	}
	
	reset() {
		this.x = 200;
		this.y = 390; 
	}
}

//Class for gems players can get for extra points
class Gem {
	constructor(image = 'gem-orange.png') {
		this.sprite = `images/${image}`;
		this.x = randomIndex([0, 100, 200, 300, 400]); 
		this.y = randomIndex ([60, 145, 230]); 
		this.points = (function() {
			switch(image) {
				case 'gem-orange.png': 
					return 2; 
					break;
				case 'gem-blue.png':
					return 3; 
					break;
				case 'gem-green.png':
					return 4;
					break; 
				default: 
					console.log('invalid image passed'); 
					return 0; 
			}
		})();
		this.width = 101; 
	}

	update() {
		//We need to remove the gem and update the score every time a player hits one 
		//recieved help from udacity student-helpers 'lloan' and 'mvalentin' on slack
		const center = this.width/2; 
		if (this.x + center > player.x && this.x - center < player.x && this.y + center > player.y && this.y - center < player.y) { // compare if the player is in the this's "personal space" i.e hitting its center
			gems.pop(); 
			score += this.points; 
			scoreCounter.textContent = `Score: ${score}`; 
		}
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player(); 
let allEnemies = [];
let gems = []
let scoreCounter = document.querySelector('#score');
createEnemies();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
	//prevent pages from scrolling 
	if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
		e.preventDefault(); 
	}
	var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

