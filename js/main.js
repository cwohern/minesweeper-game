var height = 9;
var width = 9;
var mines = 10;
var tilesArray = [];
var winLose = null;
var difficulty = "easy";
var time = 0;
var clock = null;

var gameBoard = document.querySelector(".game-board");

//Functions and event listeners:
class Tile {
    constructor (row, col) {
        this.position = [row, col];
        this.visible = "hidden";
        this.contains = null;
    }
    get adjacent() {
        var r = this.position[0];
        var c = this.position[1];
        var upLft= [r-1, c-1];
        var upMid = [r-1, c];
        var upRgt = [r-1, c+1];
        var lft = [r, c-1];
        var rgt = [r, c+1];
        var dnLft = [r+1, c-1];
        var dnMid = [r+1, c];
        var dnRgt = [r+1, c+1];
        var resultArray = [upLft, upMid, upRgt, lft, rgt, dnLft, dnMid, dnRgt];

        if (r === 0) {
            resultArray = resultArray.filter(e => {
                return e !== upLft && e !== upMid && e !== upRgt;
            })
        }
        if (r === height - 1) {
            resultArray = resultArray.filter(e => {
                return e !== dnLft && e !== dnMid && e !== dnRgt;
            })
        }
        if (c === 0) {
            resultArray = resultArray.filter(e => {
                return e !== upLft && e !== lft && e !== dnLft;
            })
        }
        if (c === width - 1) {
            resultArray = resultArray.filter(e => {
                return e !== upRgt && e !== rgt && e!== dnRgt;
            })
        }
        return resultArray;
    }
    containsFinder() {
        var adjacentMinesCount = 0;
        if (this.contains === "mine") {
            return;
        } else {
            for (var i = 0; i < this.adjacent.length; i++) {
                if (tilesArray[this.adjacent[i][1] + (this.adjacent[i][0] * width)].contains === "mine") {
                    adjacentMinesCount += 1;
                }
            }
        this.contains = adjacentMinesCount;
        }
    }
    reveal() {
        if (this.contains === "mine") {
            this.visible = "visible";
            for (var i = 0; i < tilesArray.length; i++) {
                if (tilesArray[i].contains === "mine") {
                    tilesArray[i].visible = "visible";
                }
            }
        } else if (this.contains === 0 && this.visible === "hidden") {
            this.visible = "visible";
            for (var i = 0; i < this.adjacent.length; i++) {
                tilesArray[this.adjacent[i][1] + (this.adjacent[i][0] * width)].reveal();
            }
        } else {
            this.visible = "visible";
        }
    }
}
startReStart();
function startReStart() {
    winLose = null;
    tilesArray = [];
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
    tileMaker();
    minePlacer();
    boardMaker();
    timer("set");
    render();
}

//Functions that set up the minesweeper board:
function tileMaker() {
    for (var r = 0; r < height; r++) {
        for ( var c = 0; c < width; c++){
        tilesArray.push(new Tile(r, c));
        }
    }
}

function minePlacer() {
    var minesToPush = [];

    for (var i = 0; i < mines; i++) {
        var newMine = (Math.floor(Math.random() * (height * width)));
        var tryAgain = false;

        for (var o = 0; o < minesToPush.length; o++) {
            if (minesToPush[o] === newMine) tryAgain = true;
        }

        if (tryAgain === true) {
            i -= 1;
            continue;
        } else {
            minesToPush.push(newMine);
        }
    }
    minesToPush.forEach(function(mineIndex){
        tilesArray[mineIndex].contains = "mine";
    })
    
    for (var i = 0; i < tilesArray.length; i++) {
        tilesArray[i].containsFinder();
    }
    minesToPush = [];
}

function boardMaker() {
    document.querySelector(".minesweeper").style.width = `${20 * width + 1}px`;
    document.querySelector(".game-board").style.height = `${20 * height}px`;
    for (var i = 0; i < tilesArray.length; i++) {
        var newDiv = document.createElement("DIV");
        newDiv.className = "tile";
        newDiv.id = `id${i}`;
        document.querySelector(".game-board").appendChild(newDiv);
    }
}

//Event listeners:
gameBoard.addEventListener("click", e => {
    var tile = tilesArray[parseInt(e.target.id.slice(2))];
    if (e.target.className === "game-board" || tile.visible === "visible" || winLose !== null){
        return;
    } else {
        tile.reveal();
    }
    timer("on");
    checkForWin();
    console.log(winLose);
    if (winLose !== null) timer("off");
    render();
})

document.querySelector(".game-dropdown-content").addEventListener("click", e => {
    var target = e.target.className;
    if (target === "new-game") {
        newGame();
    } else if (target === "easy" || target === "medium" || target === "hard" || target === "custom") {
        difficulty = e.target.className;
        render();
    }
})

//Event listener functions:
function newGame() {
    switch (difficulty) {
        case "easy":
            height = 9;
            width = 9;
            mines = 10;
            break;
        case "medium":
            height = 16;
            width = 16;
            mines = 40;
            break;
        case "hard":
            height = 16;
            width = 30;
            mines = 99;
            break;
        case "custom":
            height = document.getElementById("height-input").value;
            width = document.getElementById("width-input").value;
            mines = document.getElementById("mines-input").value;
            break;
    }
    startReStart();
}

function checkForWin() {
    var validVisibleCount = 0;
    for (var i = 0; i < tilesArray.length; i++) {
        if (tilesArray[i].contains === "mine" && tilesArray[i].visible === "visible") {
            winLose = "lose";
            break;
        } else if (tilesArray[i].contains !== "mine" && tilesArray[i].visible ==="visible") {
            validVisibleCount += 1;
        }
    }
    if (winLose === null && validVisibleCount >= (tilesArray.length - mines)) {
        winLose = "win";
    }
}

function timer(onOff) {
    switch (onOff) {
        case "set":
            time = 0;
            timer("off");
            clockUpdater();
            break;
        case "on":
            if(!clock) clock = setInterval(clockUpdater, 10);
            break;
        case "off":
            if(clock) clearInterval(clock);
            clock = null;
            break;
    }
}

//Render functions:
function clockUpdater() {
    time++;
    var hours = padStart(Math.floor(time / 360000));
    var minutes = padStart(Math.floor(time % 360000 / 6000));
    var seconds = padStart(Math.floor(time % 6000 / 100));
    var hundredths = padStart(Math.floor(time % 60));

    function padStart(toPad) {
        var result = null;
        toPad < 10 ? result = "0" + toPad : result = toPad;
        return result;
    }
    var clockTime = `${hours}:${minutes}:${seconds}`;
    document.querySelector(".timer").innerHTML = clockTime;
}

function render() {
    document.querySelector(".mine-counter").innerText = mines;

    var difficultyArray = ["easy", "medium", "hard", "custom"]
    for (i = 0; i < difficultyArray.length; i++) {
        var submenu = `${difficultyArray[i]}-submenu`;
        if (difficulty === difficultyArray[i]) {
            document.getElementById(difficultyArray[i]).checked = true;
            document.getElementById(submenu).style.display = "block";
        } else {
            document.getElementById(difficultyArray[i]).checked = false;
            document.getElementById(submenu).style.display = "none";
        }
    }
    
    var winLoseText = document.querySelector(".win-lose").innerText;
    switch(winLose) {
        case "lose":
            winLoseText = "You lost!";
            break;
        case "win":
            winLoseText = "You won!";
            break;
        default:
            winLoseText = "";
    }

    for (i = 0; i < tilesArray.length; i++) {
        var thisTile = document.getElementById(`id${i}`);
        
        if (tilesArray[i].visible === "hidden") {
            thisTile.style.background = "url('images/tile.png') no-repeat left top";
            thisTile.style.backgroundSize = "contain";
        } else {
            thisTile.style.background = "";
            if (tilesArray[i].contains === "mine"){
                thisTile.style.background = "url('images/mine.png') no-repeat left top";
                thisTile.style.backgroundSize = "contain";
            } else if (tilesArray[i].contains === 0) {
                thisTile.style.padding = "2px 0 0 5px";
            } else {
                thisTile.innerHTML = tilesArray[i].contains;
                thisTile.style.padding = "2px 0 0 5px";
                var colorsArray = ["rgb(6, 27, 236)", "rgb(3, 127, 0)", "rgb(255, 0, 0)", "rgb(234, 176, 0)", "rgb(181, 60, 251)", "rgb(255, 0, 186)", "rgb(0, 0, 0)", "rgb(255, 255, 255)"];
                thisTile.style.color = colorsArray[tilesArray[i].contains - 1];
            }
        }
    }
}