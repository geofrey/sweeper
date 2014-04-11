var boardwidth;
var boardheight;
var board;
var player;

var grid;
var cells;

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
var open = function(cell) {
	console.info(cell);
	cell.open = true;
	
	if(cell.monster > 0) {
		goBoom(cell);
		return;
	}
	
	var peril = danger(cell);
	console.info("threat level is "+peril);
	if(peril == 0) {
		console.info("...so let's go!");
		for(neighbor of neighbors(cell)) {
			if(!neighbor.open) {
				console.debug("now try "+cell.x+" "+cell.y);
				open(neighbor);
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
	
	vacate(document.getElementById("status"));
	doClick = open;
	
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
			box.class = "cell";
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
		if(cell.monster == 0) {
			var toNumber = document.createElement("span");
			var theDanger = danger(cell);
			toNumber.innerHTML = theDanger > 0 ? theDanger : "";
			cell.cellement.appendChild(toNumber);
		} else {
			cell.cellement.classList.add(monsterstyle[cell.monster]);
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
