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

        if (r === 0 && c === 0) {
            return [rgt, dnMid, dnRgt];
        } else if (r === 0 && c !== width - 1) {
            return [lft, rgt, dnLft, dnMid, dnRgt];
        } else if (r === 0 && c === width - 1) {
            return [lft, dnLft, dnMid];
        } else if (r !== height - 1 && c === 0) {
            return [upMid, upRgt, rgt, dnMid, dnRgt];
        } else if (r === height - 1 && c === 0) {
            return [upMid, upRgt, rgt];
        } else if (r === height - 1 && c !== width - 1) {
            return [upLft, upMid, upRgt, lft, rgt];
        } else if (r === height - 1 && c === width - 1) {
            return [upLft, upMid, lft];
        } else if (r !== height - 1 && c === width - 1) {
            return [upLft, upMid, lft, dnLft, dnMid];
        } else {
            return [upLft, upMid, upRgt, rgt, lft, dnLft, dnMid, dnRgt];
        }
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
                //or you could try making minesToPush a universal variable and iterating through that
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

var height = 16;
var width = 30;
var mines = 99;
var tilesArray = [];
var winLose = null;

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

var settings = "easy";
document.querySelector(".game-dropdown-content").addEventListener("click", function(e) {
    var easyRadio = document.getElementById("easy");
    var mediumRadio = document.getElementById("medium");
    var hardRadio = document.getElementById("hard");
    var customRadio = document.getElementById("custom");
    if (e.target.className !== "easy" || "medium" || "hard" || "custom") {
        return;
    } else if () {
        settings = "empty";
        e.target.clicked = "";
    } else if (e.target.className === "easy") {
        settings = "easy";
        medium.clicked = "";
        hard.clicked = "";
        custom.clicked = "";
    } else if (e.target.className === "medium") {
        settings = "medium";
        easy.clicked = "";
        hard.clicked = "";
        custom.clicked = "";
    } else if (e.target.className === "hard") {
        settings = "hard";
        easy.clicked = "";
        medium.clicked = "";
        custom.clicked = "";
    } else if (e.target.className === "custom") {
        settings = "custom";
        easy.clicked = "";
        medium.clicked = "";
        hard.clicked = "";
    }
})
/*
document.querySelector(".new-game").addEventListener("click", newGame)
function newGame() {
    winlose = null;
    tilesArray = [];
    // and whatever else (timer?)
    if (settings === "empty") {
        display a message "pick a difficulty!"
    }else if (settings === "easy") {
        height = 9;
        width = 9;
        mines = 10;
    } else if (settings === "medium") {
        height = 16;
        width = 16;
        mines = 40;
    } else if (settings === "hard") {
        height = 16;
        width = 30;
        mines = 99;
    } else if (settings === "custom") {
        height = get height from input
        width = get width from input
        mines = get mines from input
    }
    startReStart();
}
}
*/

document.querySelector(".game-board").addEventListener("click", function(e) {
    if (timer === null) {
        timer = setInterval(clockUpdater, 10);
    }

    if (e.target.className === "game-board"){
        return;
    }else if (tilesArray[parseInt(e.target.id.slice(2))].visible === "visible"){
        return;
    } else {
        tilesArray[parseInt(e.target.id.slice(2))].reveal();
    }

    checkForWin();
    if (winLose !== null) {
        clearInterval(timer)
        timer = null;
    }
    render();
})

function render() {
    var mineCounter = document.querySelector(".mine-counter");
    if (mines < 10) {
        mineCounter.innerText = `00${mines}`;
    } else if (mines < 100) {
        mineCounter.innerText = `0${mines}`;
    } else if (mines > 999) {
        mineCounter.innerText = `999+`;
    }else {
        mineCounter.innerText = mines;
    }
    
    var winLoseDisplay = document.querySelector(".win-lose");
    if (winLose === "lose") {
        winLoseDisplay.innerText = "You lost!";
    } else if (winLose === "win") {
        winLoseDisplay.innerText = "You won!";
    } else {
        winLoseDisplay.innerText = "";
    }

    for (i = 0; i < tilesArray.length; i++) {
        var thisTile = document.getElementById(`id${i}`);
        if (tilesArray[i].visible === "hidden") {
            thisTile.style.background = "url('images/tile.png') no-repeat left top";
            thisTile.style.backgroundSize = "contain";
        } else {
            thisTile.style.background ="";
            if (tilesArray[i].contains === "mine"){
                thisTile.style.background = "url('images/mine.png') no-repeat left top";
                thisTile.style.backgroundSize = "contain";
            } else if (tilesArray[i].contains === 0) {
                thisTile.style.padding = "2px 0 0 5px";
            } else {
                thisTile.innerHTML = tilesArray[i].contains;
                thisTile.style.padding = "2px 0 0 5px";
            }
            if (tilesArray[i].contains === 1) {
                thisTile.style.color = "rgb(6, 27, 236)";
            } else if (tilesArray[i].contains === 2) {
                thisTile.style.color = "rgb(3, 127, 0)";
            } else if (tilesArray[i].contains === 3) {
                thisTile.style.color = "rgb(255, 0, 0)";
            } else if (tilesArray[i].contains === 4) {
                thisTile.style.color = "rgb(234, 176, 0)";
            } else if (tilesArray[i].contains === 5) {
                thisTile.style.color = "rgb(181, 60, 251)";
            } else if (tilesArray[i].contains === 6) {
                thisTile.style.color = "rgb(255, 0, 186)";
            } else if (tilesArray[i].contains === 7) {
                thisTile.style.color = "rgb(0, 0, 0)";
            } else if (tilesArray[i].contains === 8) {
                thisTile.style.color = "rgb(255, 255, 255)";
            }
        }
    }
}

function startReStart() {
    tileMaker();
    minePlacer();
    boardMaker();
    render();
}
startReStart();

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

    var timer = null;
    var count = 0;
    function clockUpdater() {
        count += 1;
        var hours = Math.floor(count / 360000);
        var minutes = Math.floor(count % 360000 / 6000);
        var seconds = Math.floor(count % 6000 / 100);
        var hundredths = Math.floor(count % 60);
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        if (hundredths < 10) hundredths = "0" + hundredths
        var toDisplay = `${hours}:${minutes}:${seconds}`;
        var exactTime = `${hours}:${minutes}:${seconds}:${hundredths}`;
        document.querySelector(".timer").innerHTML = toDisplay;
    }