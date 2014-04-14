var boardwidth;
var boardheight;
var monstercount;
var board;
var player;

var grid;
var cells;
var openedCells;

var monsterstyle = [
	null,
	"m1"
];

var loseBanner = document.createElement("p");
loseBanner.innerHTML = "Game Over";

var winBanner = document.createElement("p");
winBanner.innerHTML = "Success!";

// this part looks like a good thing to move into a different file
function Coord(x, y) {
	this.x = x;
	this.y = y;
}
Coord.prototype.toString = function() {
	return "("+this.x+", "+this.y+")";
}

function vacate(element) {
	while(element.firstChild) {
		element.removeChild(element.firstChild);
		// I was the firstChild
		// just a punk in the street
	}
}
var doClick; // click handler
var firstClick = function(cell) {
	doClick = open;
	
	if(cell.monster > 0) {
		var shunt;
		// find a cell with no monster
		do {
			shunt = cells[Math.floor(Math.random() * cells.length)];
		} while(shunt.monster > 0);
		shunt.monster = cell.monster; // put ours there instead
		cell.monster = 0;
	}
	
	doClick(cell);
}
var open = function(cell) { // does it matter whether this is declared as a var or straight-up function?
	cell.open = true;
	
	if(cell.monster > 0) {
		goBoom(cell);
		return;
	}
	
	openedCells += 1;
	
	if(openedCells == boardwidth * boardheight - monstercount) {
		render(cell);
		win();
		return;
	}
	
	var peril = danger(cell);
	if(peril == 0) {
		var nextdoor = neighbors(cell)
		for(neighbor in nextdoor) {
			if(!nextdoor[neighbor].open) {
				open(nextdoor[neighbor]);
			}
		}
	}
	render(cell);
	
};
var noOp = function(cell) {};

function goBoom(cell) {
	doClick = noOp; // no more clicking
	cell.cellement.classList.add("boom");
	document.getElementById("status").appendChild(loseBanner);
	render(cell);
	for(remaining in cells) {
		if(cells[remaining].monster > 0) {
			cells[remaining].open = true;
			render(cells[remaining]);
		}
	}
}

function win() {
	doClick = noOp;
	document.getElementById("status").appendChild(winBanner);
}

function init() {
	boardwidth = parseInt(document.gamesettings.width.value);
	boardheight = parseInt(document.gamesettings.height.value);
	monstercount = parseInt(document.gamesettings.monsters.value);
	if(monstercount > boardheight * boardwidth - 1) {
		alert("No, that's too many monsters.");
		return;
	}
	var monsterlevel = parseInt(document.gamesettings.monsterlevel.value);
	player = {};
	player.hp = parseInt(document.gamesettings.health);
	player.level = parseInt(document.gamesettings.playerlevel);
	player.xp = 0;
	
	vacate(document.getElementById("status"));
	doClick = firstClick;
	
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
	
	cells = new Array();
	
	for(var row = 0; row < boardheight; row++) { // row-major for page elements
		var tr = board.insertRow();
		for(var col = 0; col < boardwidth; col++) {
			var box = tr.insertCell();
			box.className = "cell";
			// maybe use a Coord here, maybe not. Inheritance???
			var cell = {"monster" : 0, "open" : false, "cellement" : box, "x" : col, "y" : row};
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
	
	openedCells = 0;
	
	//cells.forEach(render);
	for(cell in cells) {
		render(cells[cell]);
	}
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
	
	for(var x in horizontal) {
		for(var y in vertical) {
			if(!(horizontal[x] == i && vertical[y] == j)) {
				var coord = new Coord(horizontal[x], vertical[y]);
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
	for(cell in cells) {
		cells[cell].open = false;
		render(cells[cell]);
	}
}

function uncover() {
	for(cell in cells) {
		cells[cell].open = true;
		render(cells[cell]);
	}
}

function render(cell) {
	while(cell.cellement.firstChild) {
		cell.cellement.removeChild(cell.cellement.firstChild);
	}
	if(cell.open) {
		if(cell.monster == 0) {
			var toNumber = document.createElement("span");
			var theDanger = danger(cell);
			toNumber.innerHTML = theDanger > 0 ? theDanger : "";
			cell.cellement.appendChild(toNumber);
		} else {
			//cell.cellement.classList.add(monsterstyle[cell.monster]);
			cell.cellement.className = monsterstyle[cell.monster]; // I am unconvinced.
		}
	} else {
		var toButton = document.createElement("button");
		toButton.onclick = function(event) {
			doClick(cell);
		}
		toButton.innerHTML = "";
		cell.cellement.appendChild(toButton);
	}
}
