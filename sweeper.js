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
	var monsterlevel = parseInt(document.gamesettings.monsterlevel.value);
	player = {};
	player.hp = parseInt(document.gamesettings.health);
	player.level = parseInt(document.gamesettings.playerlevel);
	player.xp = 0;
	
	var holder = document.getElementById("boardcontainer")
	while(holder.firstChild) { // exists
		holder.removeChild(holder.firstChild);
	}
	board = document.createElement("table");
	holder.appendChild(board);
	
	grid = new Array(boardwidth);
	for(var row = 0; row < boardwidth; row++) {
		grid[row] = new Array(boardheight);
	}
	console.debug(grid.length);
	console.debug(grid[0].length);
	
	cells = new Array();
	
	for(var row = 0; row < boardheight; row++) { // row-major for page elements
		var tr = board.insertRow();
		for(var col = 0; col < boardwidth; col++) {
			var td = tr.insertCell();
			// maybe use a Coord here, maybe not. Inheritance???
			var cell = {"monster" : 0, "open" : false, "cellement" : td, "x" : col, "y" : row};
			grid[col][row] = cell; // column-major for game logic
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

function neighbors(cell) {
	var i = cell.x;
	var j = cell.y;
	var out = new Array();
	var horizontal = new Array();
	var vertical = new Array();
	
	if(i > 0) horizontal.push(i-1);
	horizontal.push(i);
	if(i < (boardwidth-1)) horizontal.push(i+1);
	
	if(j > 0) vertical.push(j-1);
	vertical.push(j);
	if(j < (boardheight-1)) vertical.push(j+1);
	
	for(var x of horizontal) {
		for(var y of vertical) {
			if(!(x == i && y == j)) {
				var coord = new Coord(x, y);
				out.push(grid[coord.x][coord.y]);
			}
		}
	}
	return out;
}

function add(l, r) {
	return l + r;
}

function danger(cell) {
	return neighbors(cell)
		.map(function(c) { return c.monster; })
		.reduce(function(l, r) { return l + r; });
}

function cover() {
	for(cell of cells) {
		cell.open = false;
		render(cell);
	}
}

function uncover() {
	for(cell of cells) {
		cell.open = true;
		render(cell);
	}
}

function render(cell) {
	while(cell.cellement.firstChild) {
		cell.cellement.removeChild(cell.cellement.firstChild);
	}
	if(cell.open) {
		var toNumber = document.createElement("span");
		if(cell.monster == 0) {
			var theDanger = danger(cell);
			toNumber.innerHTML = theDanger > 0 ? theDanger : "";
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
		toButton.innerHTML = "";
		cell.cellement.appendChild(toButton);
	}
}
