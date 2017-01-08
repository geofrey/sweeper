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
	"m1",
	"m2",
	"m3",
	"m4",
	"m5",
	"m6",
	"m7",
	"m8",
	"m9"
];

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
var open = function(cell) {
	cell.open = true;
	if(cell.monster) fight(cell);
	
	openedCells += 1;
	
	if(openedCells == boardwidth * boardheight) {
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

function fight(cell) {
	var monsterhp = cell.monster;
	while(true) {
		// attack
		monsterhp -= player.level;
		if(monsterhp <= 0) {
			player.xp += cell.monster;
			if(player.xp >= player.nextlevel) {
				player.level += 1;
				player.nextlevel = parseInt(player.nextlevel * player.levelcurve);
			}
			break;
		}
		
		// counterattack
		player.hp -= cell.monster;
		if(player.hp <= 0) {
			goBoom(cell);
			break;
		}
	}
	displayStatus();
	render(cell);
}

function goBoom(cell) {
	doClick = noOp; // no more clicking
	cell.cellement.className += " boom"; // hey, shouldn't that class name be a constant or something?
	document.getElementById("lose").style.display = "inline";
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
	document.getElementById("win").style.display = "inline";
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
	player.hp = parseInt(document.gamesettings.health.value);
	player.level = 1;
	player.xp = 0;
	player.nextlevel = parseInt(document.gamesettings.firstlevel.value);
	player.levelcurve = parseFloat(document.gamesettings.levelcurve.value);
	
	doClick = firstClick;
	
	document.getElementById("win").style.display = "none";
	document.getElementById("lose").style.display = "none"; // this has got to go

	var holder = document.getElementById("boardcontainer")
	vacate(holder);
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
			var cell = {"monster" : 0, "open" : false, "flag" : false, "cellement" : box, "x" : col, "y" : row};
			grid[col][row] = cell; // column-major for game logic
			cells.push(cell);
		}
	}
	
	var toCreate = monstercount;
	while(toCreate > 0) {
		var r = Math.floor(Math.random() * cells.length);
		if(cells[r].monster == 0) {
			var level = Math.floor(Math.random() * monsterlevel) + 1;
			cells[r].monster = level;
			toCreate -= 1;
		}
	}
	
	openedCells = 0;
	
	displayStatus();
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
	var danger = 0;
	var ns = neighbors(cell);
	for(n in ns) {
		danger += ns[n].monster
	}
	return danger;
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
			cell.cellement.className += " "+monsterstyle[cell.monster];
		}
	} else {
		var toButton = document.createElement("button");
		toButton.onclick = function(event) {
			doClick(cell);
		};
		toButton.onmousemove = function(event) {
			toButton.focus();
		};
		toButton.onkeypress = function(event) {
			if(event.charCode === "f".charCodeAt(0)) {
				cell.flag = !cell.flag;
				toButton.innerHTML = cell.flag ? "!" : "";
			}
		};
		toButton.innerHTML = cell.flag ? "!" : "";
		cell.cellement.appendChild(toButton);
	}
}

function displayStatus() {
	var labels = [
		['playerhealth', player.hp],
		['playerlevel', player.level],
		['playerxp', player.xp],
		['nextlevel', player.nextlevel]
	];
	for(l in labels) {
		document
			.getElementById(labels[l][0])
			.getElementsByClassName('statusvalue')[0]
			.innerHTML = labels[l][1];
	}
}
