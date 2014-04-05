var boardwidth;
var boardheight;
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
	boardwidth = parseInt(document.gamesettings.width.value);
	boardheight = parseInt(document.gamesettings.height.value);
	var monstercount = parseInt(document.gamesettings.monsters.value);
	player = {};
	player.hp = parseInt(document.gamesettings.health);
	player.level = 1;
	player.xp = 0;
	
	var holder = document.getElementById("boardcontainer")
	while(holder.firstChild) { // exists
		holder.removeChild(holder.firstChild);
	}
	board = document.createElement("table");
	holder.appendChild(board);
	
	grid = new Array(boardheight);
	cells = new Array();
	
	for(var i = 0; i < boardheight; i++) {
		grid[i]= new Array(boardwidth);
		var row = board.insertRow();
		for(var j = 0; j < boardwidth; j++) {
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
	if(j < (boardheight-1)) vertical.push(j+1);
	
	if(i > 0) horizontal.push(i-1);
	horizontal.push(i);
	if(i < (boardwidth-1)) horizontal.push(i+1);
	
	for(var x of horizontal) {
		for(var y of vertical) {
			if(!(x == i && y == j)) {
				var coord = new Coord(x, y);
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

function cover() {
	for(cell of cells) {
		cell.open = false;
		render(cell);
		console.log("reset "+cell.x+", "+cell.y);
	}
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
