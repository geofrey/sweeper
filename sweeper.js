var x;
var y;
var board;
var player;

var grid;
var cells;

// this part looks like a good thing to move into a different file
function Coord(x, y) {
	this.x = x;
	this.y = y;
}
Coord.prototype.toString = function() {
	return "("+this.x+", "+this.y+")";
}

function init() {
	x = document.gamesettings.width.value;
	y = document.gamesettings.height.value;
	var monstercount = document.gamesettings.monsters.value;
	player = {};
	player.hp = document.gamesettings.health;
	player.level = 1;
	player.xp = 0;
	
	var holder = document.getElementById("boardcontainer")
	while(holder.firstChild) { // exists
		holder.removeChild(holder.firstChild);
	}
	board = document.createElement("table");
	holder.appendChild(board);
	
	grid = new Array(y);
	cells = new Array();
	
	for(var i = 0; i < y; i++) {
		grid[i]= new Array(x);
		var row = board.insertRow();
		for(var j = 0; j < x; j++) {
			var column = row.insertCell();
			// maybe use a Coord here, maybe not. Inheritance???
			var cell = {"monster" : 0, "open" : false, "cellement" : column, "x" : j, "y" : i};
			grid[i][j] = cell;
			cells.push(cell);
		}
	}
	
	var toCreate = monstercount;
	while(toCreate > 0) {
		var r = Math.floor(Math.random() * cells.length);
		if(cells[r].monster == 0) {
			cells[r].monster = 1;
			toCreate -= 1;
		}
	}
	
	cells.forEach(render);
}

function neighbors(i, j) {
	var out = new Array();
	var horizontal = new Array();
	var vertical = new Array();
	
	if(j > 0) vertical.push(j-1);
	vertical.push(j);
	if(j < y-1) vertical.push(j+1);
	
	if(i > 0) horizontal.push(i-1);
	horizontal.push(i);
	if(i < x-1) horizontal.push(i+1);
	
	for(x of horizontal) {
		for(y of vertical) {
			if(!(x == i && y == j)) {
				var coord = new Coord(i*1+x*1, j*1+y*1); // I knew there was going to be some language quirk going to sneak up and bite me in the butt before too long
				console.log(coord.x+", "+coord.y);
				out.push(coord);
			}
		}
	}
	return out;
}

function danger(cell) {
	var peril = 0;
	neighbors(cell.x, cell.y).forEach(function(coord) {
		peril += grid[coord.y][coord.x].monster;
	});
	return peril;
}

function render(cell) {
	while(cell.cellement.firstChild) {
		cell.cellement.removeChild(cell.cellement.firstChild);
	}
	if(cell.open) {
		var toNumber = document.createElement("span");
		if(cell.monster == 0) {
			toNumber.innerHTML = danger(cell);
		} else {
			toNumber.innerHTML = "BOOM";
		}
		cell.cellement.appendChild(toNumber);
	} else {
		var toButton = document.createElement("button");
		toButton.onclick = function(event) {
			cell.open = true;
			render(cell);
		}
		toButton.innerHTML = "?";
		cell.cellement.appendChild(toButton);
	}
}
