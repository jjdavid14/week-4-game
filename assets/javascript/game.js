// Create an object that contains the game
var game = {
	hero: undefined,
	enemy: undefined,
	availableCharacters: [],
	// Initialize the game's fields
	newGame: function() {
		// Initialize available characters on start
		this.availableCharacters = [
		Kenobi = {
			name: "Obi-Wan Kenobi",
			fullHealth: 120,
			health: 120,
			basePower: 8,
			currentPower: 8
		},
		Skywalker = {
			name: "Luke Skywalker",
			fullHealth: 100,
			health: 100,
			basePower: 5,
			currentPower: 5
		},
		Sidious = {
			name: "Darth Sidious",
			fullHealth: 150,
			health: 150,
			basePower: 20,
			currentPower: 20
		},
		Maul = {
			name: "Darth Maul",
			fullHealth: 180,
			health: 180,
			basePower: 25,
			currentPower: 25
		}
		];
		// Show the starting available characters
		this.showCharacters();
		// Adjust label to reflect start of game
		changeLabel("choose your character", "text-success", 1);

	},
	// Load the characters list on the HTML
	showCharacters: function() {
		$("#character-list").empty();
		var toAppend = "";
		for(var i = 0; i < this.availableCharacters.length; i++) {
			// Separate the character's first name and last name
			//var currentCharacter = this.availableCharacters[i].name.split(" ");
			// Get the current character's last name
			var currentLastName = getLastName(this.availableCharacters[i]);

			toAppend += '<div class="card d-inline-block m-1" style="width: 13rem;" id="' + currentLastName + '">';
			toAppend += '<h4 class="card-title d-inline">' + this.availableCharacters[i].name + '</h4>'
			toAppend += '<img class="card-img-top" id="' + currentLastName + '-img" src="assets/images/' + currentLastName + '.jpg" alt="' + this.availableCharacters[i].name +'">';
			toAppend += '<div class="card-body">';
			toAppend += '<p class="card-text">HEALTH: ' + this.availableCharacters[i].health + '</p>';
			toAppend += '</div></div>';
		}
		// Append to #character-list
		$("#character-list").append(toAppend);
	},
	// Returns the object containing the provided last name
	getCharacterByLastName: function(lastName) {
		for(var i = 0; i < this.availableCharacters.length; i++) {
			if(this.availableCharacters[i].name.toLowerCase().includes(lastName)) {
				return this.availableCharacters[i];
			}
		}
	},
	// Removes the object passed in from availableCharacters
	removeCharacterFromList: function(character) {
		var index = this.availableCharacters.indexOf(character);
		this.availableCharacters.splice(index,1);
	}
}

var backgroundAudio = new Audio("assets/audio/background.mp3");
var battleAudio = new Audio("assets/audio/battle.mp3");

// Sets up a new game
function initiateNewGame() {
	game.newGame();
	setUpEventListeners();
	backgroundAudio.play();
}

// Changes the message on the main page
function changeLabel(msg, newClass, state) {
	$("#label").removeClass("text-danger text-success text-warning text-primary");
	$("#label").text(msg.toUpperCase());
	$("#label").addClass(newClass);
	$("#label").attr("data", state);
}

// Hover event that changes the image of the hovered card
function attachHover(index) {
	// Separate the character's first name and last name
	//var currentCharacter = game.availableCharacters[index].name.split(" ");
	// Get the current character's last name
	var currentLastName = getLastName(game.availableCharacters[index]);

	$("#" + currentLastName).hover(
		function(){
			$("#" + currentLastName).addClass(getCardColor());
			$("#" + currentLastName + "-img").attr("src", "assets/images/" + currentLastName + ".gif");
		},
		function(){
			$("#" + currentLastName).removeClass(getCardColor());
			$("#" + currentLastName + "-img").attr("src", "assets/images/" + currentLastName + ".jpg");
		}
		);
}

// Click event that sets up the hero and enemy of the game
// Also updates the message on main page
function attachClick(state, index) {
	// Get the current character's last name
	var currentLastName = getLastName(game.availableCharacters[index]);

	$("#" + currentLastName).on("click", function(){
		if(state == 1) {
			changeLabel("pick your enemy", "text-danger", 2);
			game.hero = game.getCharacterByLastName(currentLastName);
			game.removeCharacterFromList(game.hero);
			updateScreen();
		}
		else if(state == 2) {
			game.enemy = game.getCharacterByLastName(currentLastName);
			game.removeCharacterFromList(game.enemy);
			updateScreen();
			showModal();
		}
	});
}

// Main page display is updated
function updateScreen() {
	game.showCharacters();
	setUpEventListeners();
}

// Attach events to all character cards
function setUpEventListeners() {
	for(var i = 0; i < game.availableCharacters.length; i++) {
		attachHover(i);
		attachClick($("#label").attr("data"), i);
	}
}

// Returns the background color to use, depends on label's data
function getCardColor() {
	var state = $("#label").attr("data");
	var toRet = undefined;
	if(state == 1) {
		toRet = "bg-success";
	} else if (state == 2) {
		toRet = "bg-danger";
	}
	return toRet;
}

// Pops up the modal
function showModal() {
	changeModalBody();
	$("#myModal").modal("show");
}

// Stops background music and starts battle music when modal pops up
$('#myModal').on('show.bs.modal', function () {
	backgroundAudio.pause();
	battleAudio.play();
})

// Stops battle music and starts background music when modal closes
$('#myModal').on('hidden.bs.modal', function () {
	battleAudio.pause();
	backgroundAudio.play();
})

// Shows the current state of the modal
function changeModalBody() {
	// Get the hero's last name
	var heroLastName = getLastName(game.hero);
	// Get the enemy's last name
	var enemyLastName = getLastName(game.enemy);

	$("#hero-modal-img").attr("src", "assets/images/" + heroLastName + ".jpg");
	$("#enemy-modal-img").attr("src", "assets/images/" + enemyLastName + ".jpg");
	$("#hero-modal-health").text(game.hero.health);
	$("#enemy-modal-health").text(game.enemy.health);

	$("#modalTitle").text(game.hero.name + " VS " + game.enemy.name);
	$("#battle-text").empty();
}

function getLastName(obj) {
	// Separate the character's first name and last name
	var currentCharacter = obj.name.split(" ");
	// Get the current character's last name
	return currentCharacter[1].toLowerCase();
}

// Function that runs when the attack button on the modal is clicked
function attack() {
	// Hero attack enemy
	game.enemy.health -= game.hero.currentPower;
	// Log the hero attack
	var heroLog = game.hero.name + " ATTACKED " + game.enemy.name + " FOR " + game.hero.currentPower + " DAMAGE!";
	// Update enery progress bar
	$("#enemy-progress").attr("aria-valuenow", game.enemy.health / game.enemy.fullHealth * 100);
	$("#enemy-progress").attr("style", "width: " + (game.enemy.health / game.enemy.fullHealth * 100) + "%");
	// Increase hero attack
	game.hero.currentPower += game.hero.basePower;
	// Hero animation
	$("#hero-card").animateCss("bounceOutRight");


	// Check if enemy defeated
	if(game.enemy.health <= 0) {
		// Check if user wins the game
		if(hasWon()) {
			// Invoke win to change main page
			win();
		}
		// Close the modal
		$("#myModal").modal("hide");
		// Update the progress bar of enemy
		$("#enemy-progress").attr("aria-valuenow", "100");
		$("#enemy-progress").attr("style", "width: 100%");
		// Remove lingering hero animation
		$("#hero-card").removeClass("animated bounceOutRight");
		return;
	}

	// Enemy counter-attacks
	game.hero.health -= game.enemy.basePower;
	// Update hero progress bar
	$("#hero-progress").attr("aria-valuenow", game.hero.health / game.hero.fullHealth * 100);
	$("#hero-progress").attr("style", "width: " + (game.hero.health / game.hero.fullHealth * 100) + "%");
	// Log the enemy attack
	var enemyLog = game.enemy.name + " COUNTER-ATTACKS " + game.hero.name + " FOR " + game.enemy.basePower + " DAMAGE!";
	// Enemy animation
	$("#enemy-card").animateCss("bounceOutLeft");

	// Check if hero is defeated
	if(game.hero.health <= 0) {
		lost();
		$("#myModal").modal("hide");
		return;
	}

	// Update the modal
	changeModalBody();

	// Put the hero and enemy logs in a p tag
	$("#battle-text").append($("<p class='text-center'>").text(heroLog));
	$("#battle-text").append($("<p class='text-center'>").text(enemyLog));
}

// Checks if player has won the game
function hasWon() {
	return game.availableCharacters.length == 0;
}

// Reset hero progress bard and display winning message
function win() {
	// Update the progress bar of hero
	$("#hero-progress").attr("aria-valuenow", "100");
	$("#hero-progress").attr("style", "width: 100%");
	// Update main page to display winning message and show new game button
	changeLabel("You Won!", "text-primary", 3);
	showNewGameButton();
}

// Resets the progress bars and clears any lingering animation
// Displays lost message
function lost() {
	// Update the progress bar of hero
	$("#hero-progress").attr("aria-valuenow", "100");
	$("#hero-progress").attr("style", "width: 100%");
	// Update the progress bar of enemy
	$("#enemy-progress").attr("aria-valuenow", "100");
	$("#enemy-progress").attr("style", "width: 100%");
	// Remove lingering hero animation
	$("#hero-card").removeClass("animated bounceOutRight");
	// Remove lingering enemy animation
	$("#enemy-card").removeClass("animated bounceOutRight");
	changeLabel("You Lost.", "text-warning", 3);
	showNewGameButton();
}

// Appends a new game button on the main page
function showNewGameButton() {
	var toAppend = '<button onclick="initiateNewGame()" type="button" class="btn btn-primary btn-lg">Start a New Game</button>';
	$("#character-list").empty();
	$("#character-list").append(toAppend);
}

// Adds new jQuery function that adds animation
$.fn.extend({
	animateCss: function (animationName) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass('animated ' + animationName);
		});
		return this;
	}
});

// Start a new game on load
initiateNewGame();